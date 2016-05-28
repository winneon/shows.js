"use strict";

var electron = require("electron"),
    path     = require("path");

var app = electron.app;
var mainWindow = undefined;

function Window(){
	this.getWindow = () => mainWindow;

	this.generateWindow = () => {
		mainWindow = new electron.BrowserWindow({
			title: "shows.js",
			width: 1280,
			height: 720,
			minWidth: 1280,
			minHeight: 720,
			frame: false,
			show: false,
			backgroundColor: "#36393E"
		});

		mainWindow.loadURL("http://local.winneon.moe/connect/rooms");
		//mainWindow.webContents.openDevTools();

		mainWindow.on("closed", () => {
			mainWindow = undefined;
		});

		mainWindow.webContents.on("did-finish-load", (event) => {
			mainWindow.show();
		});

		return mainWindow;
	};
}

module.exports = new Window();