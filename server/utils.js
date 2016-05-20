"use strict";

var config = require("./config");

function Utils(){ }

Utils.prototype.authURL = function(){
	return "https://discordapp.com/oauth2/authorize?client_id=" + config.client_id + "&response_type=code&scope=identify%20guilds.join&redirect_uri=" + config.domain + "/authenticate";
};

Utils.prototype.cookie = function(name, value, age){
	if (!age){
		age = 999999999;
	}

	return name + "=" + value + "; Max-Age=" + age + "; path=/"
};

module.exports = new Utils();