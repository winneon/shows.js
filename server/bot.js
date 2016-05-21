"use strict";

var path = require("path"),
    fs   = require("fs");

var config = require("./config");

function Bot(){
	this.discord = require("discord.js");
	this.bot = new this.discord.Client();
	this.authed = false;

	this.bot.on("ready", () => {
		console.log("Successfully logged in as " + this.bot.user.username + "!");
		this.authed = true;

		var commands = require("./commands")(this);
		var dir = fs.readdirSync(path.join(__dirname, "commands"));

		for (var i = 0; i < dir.length; i++){
			var command = dir[i].split(".");

			command.pop();
			command = command.join(".");

			commands.registerCommand(command);
		}
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

// the below functions only exist because they're not in the discord.js api for some reason

Bot.prototype.getChannelByID = function(id){
	var channels = this.bot.servers[0].channels;

	for (var i = 0; i < channels.length; i++){
		var channel = channels[i];

		if (channel.id == id){
			return channel;
		}
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

Bot.prototype.getRoleByID = function(id){
	var roles = this.bot.servers[0].roles;

	for (var i = 0; i < roles.length; i++){
		var role = roles[i];

		if (role.id == id){
			return role;
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

Bot.prototype.getUserByID = function(id){
	var users = this.bot.servers[0].members;

	for (var i = 0; i < users.length; i++){
		var user = users[i];

		if (user.id == id){
			return user;
		}
	}

	return undefined;
};

Bot.prototype.stripID = function(id){
	return id.replace(/\D/g, "");
};

module.exports = new Bot();