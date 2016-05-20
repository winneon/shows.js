"use strict";

var crypto = require("crypto");
var config = require("./config");

function Encryption(){ }

Encryption.prototype.authenticate = function(cookie){
	var valid = true;

	if (cookie && cookie.user && cookie.user_id && cookie.access && cookie.refresh){
		try {
			this.decrypt(cookie.user);
			this.decrypt(cookie.user_id);
			this.decrypt(cookie.access);
			this.decrypt(cookie.refresh);
		} catch (error){
			valid = false;
		}
	} else {
		valid = false;
	}

	return valid;
};

Encryption.prototype.encrypt = function(text){
	var cipher = crypto.createCipher("aes-256-cbc", config.encryption);
	var encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");
	
	return encrypted;
};

Encryption.prototype.decrypt = function(text){
	var decipher = crypto.createDecipher("aes-256-cbc", config.encryption);
	var decrypted = decipher.update(text, "hex", "utf8");
	decrypted += decipher.final("utf8");
	
	return decrypted;
};

module.exports = new Encryption();