"use strict";

var $      = require("jquery"),
    open   = require("open"),
    remote = require("electron").remote;

$("section.window_buttons svg.minimize").on("click", (event) => {
	remote.getCurrentWindow().minimize();
});

$("section.window_buttons svg.maximize").on("click", (event) => {
	var window = remote.getCurrentWindow();

	if (window.isMaximized()){
		window.unmaximize();
	} else {
		window.maximize();
	}
});

$("section.window_buttons svg.close").on("click", (event) => {
	remote.getCurrentWindow().close();
});

$("a").on("click", (event) => {
	var href = $(event.target).attr("href");

	if (href != undefined){
		open(href);
	}

	return false;
})