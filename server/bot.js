"use strict";

var config = require("./config");

function Bot(){
	this.discord = require("discord.js");
	this.bot = new this.discord.Client();
	this.authed = false;

	this.bot.on("ready", () => {
		console.log("Successfully logged in as " + this.bot.user.username + "!");
		this.authed = true;
	});

	this.bot.loginWithToken(config.bot_token, (error, token) => {
		if (error){
			console.log("An error occurred logging in to the bot.");
			console.log(error);

			process.exit(1);
		}
	});
}

Bot.prototype.getDiscord = function(){
	return this.discord;
};

Bot.prototype.getBot = function(){
	if (this.authed){
		return this.bot;
	}

	return undefined;
};

Bot.prototype.getChannelByName = function(name, type){
	var channels = this.bot.servers[0].channels;
	var channelType = type || "text";

	for (var i = 0; i < channels.length; i++){
		var channel = channels[i];

		if (channel.type == channelType && channel.name.toLowerCase() == name.toLowerCase()){
			return channel;
		}
	}

	return undefined;
};


Bot.prototype.getRoleByName = function(name){
	var roles = this.bot.servers[0].roles;

	for (var i = 0; i < roles.length; i++){
		var role = roles[i];

		if (role.name.toLowerCase() == name.toLowerCase()){
			return role;
		}
	}

	return undefined;
};

Bot.prototype.sendMessage = function(channel, content, options, callback){
	this.bot.sendMessage(channel, content, options, function(error){
		if (error){
			console.log("An error occurred sending a message.");
			console.log(error);
		} else if (callback){
			callback();
		}
	});
};

module.exports = new Bot();