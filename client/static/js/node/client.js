"use strict";

function Client(){
	this.io = require("socket.io-client")("http://local.winneon.moe:80");
}

module.exports = new Client();