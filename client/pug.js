// credit to https://github.com/yan-foto/electron-pug for the original code

"use strict";

var electron = require("electron"),
    mime     = require("mime"),
    pug      = require("pug"),
    path     = require("path"),
    fs       = require("fs"),
    util     = require("util"),
    url      = require("url");

var app = electron.app;
var extend = util._extend;

function Pug(pugOptions, locals){
	app.on("ready", () => {
		var options = extend({}, pugOptions || {});

		electron.protocol.interceptBufferProtocol("file", (request, callback) => {
			var file = getPath(request.url);
			var content = undefined;

			try {
				content = fs.readFileSync(file);
				var ext = path.extname(file);

				if (ext == ".pug"){
					return callback({
						data: new Buffer(pug.compileFile(file, pugOptions)(locals)),
						mimeType: "text/html"
					});
				} else {
					return callback({
						data: content,
						mimeType: mime.lookup(ext)
					});
				}
			} catch (error){
				if (error.code == "ENOENT"){
					return callback(6);
				}

				console.log("An error occured.")
				console.log(error);

				return callback(2);
			}
		}, (error, scheme) => {
			if (error){
				console.log("Jade interceptor failed:");
				console.log(error)
			} else {
				console.log("Jade interceptor registered successfully.")
			}
		});
	});
}

function getPath(link){
	var parsed = url.parse(link);
	var result = parsed.pathname;

	if (process.platform == "win32" && !parsed.host.trim()){
		result = result.substr(1);
	}

	return result;
}

module.exports = Pug;