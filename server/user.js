"use strict";

function User(options){
	if (!(this instanceof User)){
		return new User(options);
	}

	this.name = options.name;
	this.id = options.id;

	this.accessToken = options.access;
	this.refreshToken = options.refresh;

	this.socketID = options.socket;
};

User.prototype.getName = function(){
	return this.name;
};

User.prototype.getID = function(){
	return this.id;
};

User.prototype.getAccessToken = function(){
	return this.accessToken;
};

User.prototype.getRefreshToken = function(){
	return this.refreshToken;
};

User.prototype.getSocket = function(){
	return global.io.sockets.connected[this.socketID];
};

module.exports = User;