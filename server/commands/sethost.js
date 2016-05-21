"use strict";

function SetHost(bot){
	if (!(this instanceof SetHost)){
		return new SetHost(bot);
	}

	this.bot = bot;

	this.usage = "%cmd% [@user]";
	this.description = "Set your room's host to a specified user.";
	this.argCount = 1;
}

SetHost.prototype.runCommand = function(message, args){
	var room = global.rooms.getRoom(message.channel.name);

	if (room.getHost().id == message.author.id){
		args[0] = this.bot.stripID(args[0]);

		if (room.getUsers()[args[0]]){
			global.rooms.setHost(room.getName(), room.getUsers()[args[0]]);
			this.bot.sendMessage(message.channel, "Set this room's host to " + this.bot.getUserByID(args[0]).mention() + ".");
		} else {
			this.bot.sendMessage(message.channel, "That user isn't in this room!");
		}
	} else {
		this.bot.sendMessage(message.channel, "You're not this room's host!");
	}
};

module.exports = SetHost;