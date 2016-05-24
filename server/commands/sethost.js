"use strict";

function SetHost(bot){
	if (!(this instanceof SetHost)){
		return new SetHost(bot);
	}

	this.bot = bot;

	this.usage = "%cmd% [@user]";
	this.description = "Set your room's host to a specified user.";
	this.argCount = 1;

	this.hostOnly = true;
}

SetHost.prototype.runCommand = function(room, message, args){
	args[0] = this.bot.stripID(args[0]);

	if (room.getUser(args[0])){
		global.rooms.setHost(room.name, room.getUser(args[0]));
		this.bot.sendMessage(message.channel, "Set this room's host to " + this.bot.getUserByID(args[0]).mention() + ".");
	} else {
		this.bot.sendMessage(message.channel, "That user isn't in this room!");
	}
};

module.exports = SetHost;