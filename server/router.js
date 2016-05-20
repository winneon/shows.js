"use strict";

var config = require("./config");

function Router(express, app, io){
	app.get("/api/auth_url", (req, res) => {
		res.json({
			url: require("./serve").authURL()
		});
	});

	app.get("/authenticate", (req, res) => {
		if (req.query && req.query.code){
			require("request").post("https://discordapp.com/api/oauth2/token", {
				form: {
					grant_type: "authorization_code",
					code: req.query.code,
					redirect_uri: "http://local.winneon.moe/authenticate",
					client_id: config.client_id,
					client_secret: config.client_secret
				}
			}, (error, response, body) => {
				var creds = JSON.parse(body);

				require("request")({
					url: "https://discordapp.com/api/invites/" + config.invite_id,
					method: "POST",
					auth: {
						bearer: creds.access_token
					}
				}, (error, response, body) => {
					require("request")({
						url: "https://discordapp.com/api/users/@me",
						method: "GET",
						auth: {
							bearer: creds.access_token
						}
					}, (error, response, body) => {
						res.cookie("user", require("./encryption").encrypt(JSON.parse(body).username), {
							maxAge: 999999999
						});

						res.cookie("user_id", require("./encryption").encrypt(JSON.parse(body).id), {
							maxAge: 999999999
						});

						res.cookie("access", require("./encryption").encrypt(creds.access_token), {
							maxAge: 999999999
						});

						res.cookie("refresh", require("./encryption").encrypt(creds.refresh_token), {
							maxAge: 999999999
						});

						var url = "/";

						if (req.cookies.next){
							url = req.cookies.next;
						}

						res.cookie("next", "", {
							maxAge: 0
						});

						res.redirect(url);
					});
				});
			});
		}
	});

	app.get("/connect/*", (req, res, next) => {
		res.serviceLoad = req.path.replace("/connect", "");
		res.path = "/connect";

		next();
	});

	app.get("/room/*", (req, res, next) => {
		res.path = "/room";
		res.locals.room = req.path.replace("/room/", "");

		next();
	});

	app.get("/logout", (req, res) => {
		res.cookie("user", "", {
			maxAge: 0
		});

		res.cookie("user_id", "", {
			maxAge: 0
		});

		res.cookie("access", "", {
			maxAge: 0
		});

		res.cookie("refresh", "", {
			maxAge: 0
		});

		res.cookie("next", "", {
			maxAge: 0
		});

		res.redirect("/");
	});
}

module.exports = Router;