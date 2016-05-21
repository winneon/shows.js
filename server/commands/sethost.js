"use strict";

function SetHost(bot){
	if (!(this instanceof SetHost)){
		return new SetHost(bot);
	}

	this.bot = bot;

	this.usage = "%cmd% [@user]";
	this.description = "Set your room's host to a specified user.";
}

SetHost.prototype.runCommand = function(message, args){
	
};

module.exports = SetHost;