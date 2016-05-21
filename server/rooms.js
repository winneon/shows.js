"use strict";

var config = require("./config");

function Rooms(){
	this.rooms = { };
}

Rooms.prototype.getRooms = function(){
	return this.rooms;
};

Rooms.prototype.getRoom = function(name){
	return this.rooms[name];
};

Rooms.prototype.getUser = function(id){
	for (var room in this.rooms){
		var users = this.rooms[room].getUsers()

		for (var user in users){
			if (users[user].getID() == id){
				return users[user];
			}
		}
	}

	return undefined;
};

Rooms.prototype.hasRoom = function(name){
	return this.rooms[name] ? true : false;
};

Rooms.prototype.addUser = function(name, user){
	var socket = user.getSocket();

	if (this.rooms[name]){
		if (socket.room){
			this.remUser(user);
		}

		this.rooms[name].addUser(user);

		return true;
	}

	return false;
};

Rooms.prototype.remUser = function(user, socket){
	if (!socket){
		socket = user.getSocket();
	}

	var name = socket.room;

	if (name){
		this.rooms[name].remUser(user, socket);

		if (Object.keys(this.rooms[name].getUsers()).length == 0){
			delete this.rooms[name];

			global.bot.getBot().deleteChannel(global.bot.getChannelByName(name, "text").id);
			global.bot.getBot().deleteChannel(global.bot.getChannelByName(name, "voice").id);
		}

		return true;
	}

	return false;
};

Rooms.prototype.addRoom = function(room){
	if (!this.rooms[room.getName()]){
		this.rooms[room.getName()] = room;

		global.bot.getBot().createChannel(config.server_id, room.getName(), "text", (error, channel) => {
			if (error){
				console.log("An error occurred creating the text channel.");
			}
		});

		global.bot.getBot().createChannel(config.server_id, room.getName(), "voice", (error, channel) => {
			if (error){
				console.log("An error occurred creating the text channel.");
			}
		});

		return true;
	}

	return false;
};

module.exports = new Rooms();