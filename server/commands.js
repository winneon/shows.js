"use strict";

var config = require("./config");

function Commands(bot){
	if (!(this instanceof Commands)){
		return new Commands(bot);
	}

	this.bot = bot;
	this.commands = { };

	this.bot.getBot().on("message", (message) => {
		var text = message.content;

		if (text.startsWith(".")){
			var command = text.split(" ")[0].replace(".", "").toLowerCase();
			var args = text.split(" ");

			args.splice(0, 1);

			if (command == "help"){
				this.bot.sendMessage(message.channel, this.getHelp());
			} else {
				if (Object.keys(this.commands).indexOf(command) > -1){
					if (this.commands[command].global){
						this._checkCommand(command, message, args);
					} else {
						if (config.exempt_room_names.indexOf(message.channel.name) == -1){
							this._checkCommand(command, message, args);
						} else {
							this.bot.sendMessage(message.channel, "This channel is not a room! Join a room before using commands.");
						}
					}
				} else {
					this.bot.sendMessage(message.channel, "That command doesn't exist! Try running `.help` for a list of commands.");
				}
			}
		}
	});
}

Commands.prototype._checkCommand = function(command, message, args){
	var room = global.rooms.getRoom(message.channel.name);

	if (this.commands[command].hostOnly && room.getHost().getID() == message.author.id){
		if (this.commands[command].argCount <= args.length){
			console.log("Command: ." + command);
			this.commands[command].runCommand(room, message, args);
		} else {
			this.bot.sendMessage(message.channel, "```Usage: ." + this.commands[command].usage.replace("%cmd%", command) + "```");
		}
	} else {
		this.bot.sendMessage(message.channel, "You're not this room's host!");
	}
}

Commands.prototype.getHelp = function(){
	var header = "```\n" +
	"shows.js, running version " + require("./package.json").version + "\n" +
	"\n";

	var contents = "";

	for (var command in this.commands){
		var commandObj = this.commands[command];

		contents += commandObj.usage.replace("%cmd%", "." + command) + "\n";
		contents += "  " + commandObj.description + "\n\n";
	}

	var footer = "```";

	return header + contents + footer;
};

Commands.prototype.registerCommand = function(command){
	try {
		this.commands[command] = require("./commands/" + command)(this.bot);
	} catch (error){
		console.log("The command " + command + " doesn't exist!");
	}
};

module.exports = Commands;