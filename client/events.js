"use strict";

var electron = require("electron");

var window = require("./window");
var app = electron.app;

app.on("ready", window.generateWindow);

app.on("window-all-closed", function(){
	if (process.platform != "darwin"){
		app.quit();
	}
});

app.on("activate", function(){
	if (!window.getWindow()){
		window.generateWindow();
	}
});