"use strict";

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
		socket.join(name);

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
		}

		return true;
	}

	return false;
};

Rooms.prototype.addRoom = function(room){
	if (!this.rooms[room.getName()]){
		this.rooms[room.getName()] = room;

		return true;
	}

	return false;
};

module.exports = new Rooms();