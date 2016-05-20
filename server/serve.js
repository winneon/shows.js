"use strict";

var fs   = require("fs"),
    path = require("path");

var config = require("./config");
var utils = require("./utils");

module.exports = function(req, res, next){
	res.locals.basedir = req.app.get("views");
	res.locals.client_id = config.client_id;
	res.locals.user = req.cookies.user;
	res.locals.auth_url = utils.authURL();
	res.locals.service = res.serviceLoad;

	res.locals.hostname = config.domain;
	res.locals.port = config.port;

	var file = res.path;

	if (!file){
		file = req.path == "/" ? "/index" : req.path;
	}

	file = file.substring(1,
		file.substring(file.length - 1, file.length) == "/" ? file.length - 1 : file.length
	);

	if (fs.existsSync(path.join("static", file))){
		res.end();
		next();
	} else {
		if (fs.existsSync(path.join("static", file + ".pug"))){
			res.render(file, function(error, html){
				if (error){
					res.end();
					console.log(error);
				} else {
					res.send(html);
					next();
				}
			});
		} else {
			res.redirect("/");
		}
	}
};