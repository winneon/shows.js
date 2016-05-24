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

Rooms.prototype.setHost = function(name, user){
	if (this.rooms[name]){
		var room = this.rooms[name];

		if (room.getUser(user.getID())){
			var prevHost = room.getHost();

			global.bot.getBot().removeUserFromRole(prevHost.getID(), global.bot.getRoleByName(name + " Host").id, (error) => {
				if (error){
					console.log("An error occurred removing the host from the host role.");
					console.log(error);

					if (callback){
						callback(false);
					}
				} else {
					global.bot.getBot().addUserToRole(user.getID(), global.bot.getRoleByName(name + " Host").id, (error) => {
						if (error){
							console.log("An error occurred adding a user to the host role.");
							console.log(error);

							if (callback){
								callback(false);
							}
						} else {
							room.setHost(user);

							if (callback){
								callback(true);
							}
						}
					});
				}
			});

			return true;
		}
	}

	if (callback){
		callback(false);
	}

	return false;
};

Rooms.prototype.addUser = function(name, user){
	var socket = user.getSocket();

	if (this.rooms[name]){
		if (socket.room){
			this.remUser(user);
		}

		this.rooms[name].addUser(user);

		global.bot.getBot().addUserToRole(user.getID(), global.bot.getRoleByName(name).id, (error) => {
			if (error){
				console.log("An error occurred adding a user to the channel role.");
				console.log(error);
			}
		});

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

		global.bot.getBot().removeUserFromRole(user.getID(), global.bot.getRoleByName(name).id, (error) => {
			if (error){
				console.log("An error occurred adding a user to the channel role.");
				console.log(error);
			}
		});

		if (Object.keys(this.rooms[name].getUsers()).length == 0){
			delete this.rooms[name];

			global.bot.getBot().deleteChannel(global.bot.getChannelByName(name, "text").id);
			global.bot.getBot().deleteChannel(global.bot.getChannelByName(name, "voice").id);
			global.bot.getBot().deleteRole(global.bot.getRoleByName(name));
			global.bot.getBot().deleteRole(global.bot.getRoleByName(name + " Host"));
		}

		return true;
	}

	return false;
};

Rooms.prototype.addRoom = function(room){
	if (!this.rooms[room.getName()]){
		this.rooms[room.getName()] = room;

		global.bot.getBot().createRole(config.server_id, {
			color: 0x99AAB5,
			hoist: false,
			name: room.getName().capitalize(),
			permissions: [ ]
		}, (error, role) => {
			if (error){
				console.log("An error occurred creating a room role.");
				console.log(error);
			} else {
				global.bot.getBot().addUserToRole(room.getHost().getID(), role.id, (error) => {
					if (error){
						console.log("An error occurred adding the host to the channel role.");
						console.log(error);
					}

					global.bot.getBot().createRole(config.server_id, {
						hoist: true,
						name: room.getName().capitalize() + " Host",
						permissions: [ ]
					}, (error, role) => {
						if (error){
							console.log("An error occurred creating a host role.");
							console.log(error);
						} else {
							global.bot.getBot().addUserToRole(room.getHost().getID(), role.id, (error) => {
								if (error){
									console.log("An error occurred adding the host to the host role.");
									console.log(error);
								}
							});
						}
					});
				});

				global.bot.getBot().createChannel(config.server_id, room.getName(), "text", (error, channel) => {
					if (error){
						console.log("An error occurred creating a text channel.");
						console.log(error);
					} else {
						global.bot.getBot().overwritePermissions(channel.id, global.bot.getRoleByID(config.server_id), {
							readMessages: false
						}, (error) => {
							if (error){
								console.log("An error occured disabling @everyone role perms.");
								console.log(error);
							}
						});

						global.bot.getBot().overwritePermissions(channel.id, role, {
							readMessages: true
						}, (error) => {
							if (error){
								console.log("An error occured enabling channel role perms.");
								console.log(error);
							}
						});
					}
				});

				global.bot.getBot().createChannel(config.server_id, room.getName(), "voice", (error, channel) => {
					if (error){
						console.log("An error occurred creating a voice channel.");
						console.log(error);
					} else {
						global.bot.getBot().overwritePermissions(channel.id, global.bot.getRoleByID(config.server_id), {
							voiceConnect: false
						}, (error) => {
							if (error){
								console.log("An error occured disabling @everyone role perms.");
								console.log(error);
							}
						});

						global.bot.getBot().overwritePermissions(channel.id, role, {
							voiceConnect: true
						}, (error) => {
							if (error){
								console.log("An error occured enabling channel role perms.");
								console.log(error);
							}
						});
					}
				});
			}
		});

		return true;
	}

	return false;
};

module.exports = new Rooms();