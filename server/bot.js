"use strict";

function Bot(){
	var discord = require("discord.js");
	var config = require("./config");

	var bot = new discord.Client();

	bot.on("ready", () => {
		console.log("Successfully logged in as " + bot.user.username + "!");
	});

	bot.loginWithToken(config.bot_token, (error, token) => {
		if (error){
			console.log("An error occurred logging in.");
			console.log(error);

			process.exit(1);
		}
	});

	return {
		discord: discord,
		bot: bot
	};
}

module.exports = new Bot();