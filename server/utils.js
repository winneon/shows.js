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

// credit to http://stackoverflow.com/a/3291856
String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = new Utils();