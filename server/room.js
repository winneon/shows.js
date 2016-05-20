"use strict";

function Room(name){
	if (!(this instanceof Room)){
		return new Room(name);
	}

	this.name = name;
	this.host = undefined;
	this.users = { };
	this.passUsers = { };

	this.password = undefined;
}

Room.prototype.getName = function(){
	return this.name;
};

Room.prototype.getHost = function(){
	return this.host;
};

Room.prototype.getUsers = function(){
	return this.users;
};

Room.prototype.getUser = function(id){
	for (var user in this.users){
		if (this.users[user].getID() == id){
			return this.users[user];
		}
	}

	return undefined;
};

Room.prototype.getPasswordUser = function(id){
	for (var user in this.passUsers){
		if (this.passUsers[user].getID() == id){
			return this.passUsers[user];
		}
	}

	return undefined;
};

Room.prototype.hasPassword = function(){
	return this.password ? true : false;
};

Room.prototype.setHost = function(user){
	if (this.users[user.getID()]){
		this.host = user;

		return true;
	}

	return false;
};

// i'll improve the lack of encryption here later
Room.prototype.setPassword = function(pass){
	this.password = pass;
};

Room.prototype.addUser = function(user){
	if (this.getPasswordUser(user.getID())){
		this.remPasswordUser(user);
	}

	user.getSocket().room = this.getName();
	this.users[user.getID()] = user;
};

Room.prototype.addPasswordUser = function(user){
	if (this.getUser(user.getID())){
		this.remUser(user);
	}

	this.passUsers[user.getID()] = user;
};

Room.prototype.remUser = function(user, socket){
	if (!socket){
		socket = user.getSocket();
	}

	socket.room = undefined;
	delete this.users[user.getID()];
};

Room.prototype.remPasswordUser = function(user){
	delete this.passUsers[user.getID()];
};

module.exports = Room;