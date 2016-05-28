"use strict";

if (require("./squirrel")){
	process.exit(0);
}

process.env.NODE_MODULES = require("path").join(__dirname, "node_modules");

console.log_copy = console.log.bind(console);
console.log = function(data){
	var date  = new Date().toString(),
	    split = date.split(" "),
	    time  = split[4] + " " + split[1] + "/" + split[2];

	this.log_copy("[" + time + "]: >", data);
};

require("./events");