"use strict";

var express  = require("express"),
    socketio = require("socket.io"),
    body_p   = require("body-parser"),
    cookie_p = require("cookie-parser"),
    sock_c   = require("socket.io-cookie"),
    http     = require("http"),
    path     = require("path");

var config = require("./config");
var router = require("./router");
var serve = require("./serve");
var encrypt = require("./encryption");
var utils = require("./utils");

var app = express();
var server = http.Server(app);

global.bot = require("./bot");
global.rooms = require("./rooms");
global.io = socketio(server);

app.set("trust proxy", "loopback");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "static"));

app.use(body_p.urlencoded({ extended: true }));
app.use(body_p.json());
app.use(cookie_p());

router(express, app);

app.use(express.static(app.get("views")));
app.use(serve);

global.io.use(sock_c);

global.io.on("connection", (socket) => {
	var cookie = socket.handshake.headers.cookie;
	var pathname = socket.handshake.headers.referer.replace(config.domain, "");
	var authed = encrypt.authenticate(cookie);

	if (authed){
		socket.user = require("./user")({
			name: encrypt.decrypt(cookie.user),
			id: encrypt.decrypt(cookie.user_id),
			access: encrypt.decrypt(cookie.access),
			refresh: encrypt.decrypt(cookie.refresh),
			socket: socket.id
		});
	} else {
		socket.emit("cookie", {
			name: "next",
			value: pathname
		});

		socket.emit("redirect", utils.authURL());
		return;
	}

	console.log("Authed: " + socket.user.getName());

	socket.on("disconnect", () => {
		if (socket.room){
			global.rooms.remUser(socket.user, socket);
		}
	});

	socket.on("service", (service) => {
		if (socket.room){
			if (global.rooms.hasRoom(socket.room)){
				global.rooms.remUser(socket.user);
			}

			socket.room = undefined;
		}

		if (service.startsWith("/rooms")){
			socket.emit("finished", {
				valid: true
			});
		} else if (service.startsWith("/room/")){
			var name = service.replace("/room/", "");

			if (config.exempt_room_names.indexOf(name) > -1){
				socket.emit("finished", {
					valid: false,
					message: "Invalid room name."
				});
			} else if (!/^[a-z]+$/i.test(name)){
				socket.emit("finished", {
					valid: false,
					message: "Room names must only have letters."
				});
			} else {
				var message = undefined;

				if (global.rooms.hasRoom(name)){
					global.rooms.addUser(name, socket.user);
				} else {
					var room = require("./room")(name);

					room.addUser(socket.user);
					room.setHost(socket.user);

					global.rooms.addRoom(room);

					if (global.bot.getUserByID(socket.user.getID()).status == "offline"){
						message = "You're not logged into Discord! If you're not logged in, you won't be able to control this room & its video."
					}
				}

				socket.emit("finished", {
					valid: true,
					message: message
				});
			}
		} else {
			socket.emit("redirect", "/");
		}
	});

	socket.on("get_rooms", () => {
		var data = { };
		var list = global.rooms.getRooms();

		for (var room in list){
			var room = list[room];

			data[room.getName()] = {
				name: room.getName(),
				host: room.getHost().getName(),
				pass: room.hasPassword()
			};
		}

		socket.emit("get_rooms", data);
	});

	socket.on("error", (error) => {
		console.log(error.stack);
	});
});

server.listen(config.port, () => {
	console.log("Server started on port " + config.port + ".");
});