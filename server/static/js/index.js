var button = $("a.button");

/*if (navigator.platform.indexOf("Mac") > -1){
	button.text("Download For Mac OS X");
} else if (navigator.platform.indexOf("Linux") > -1){
	button.text("Download For Linux");
} else {
	button.text("Download For Windows");
	button.attr("href", "/dist/win32.exe");
}*/

button.addClass("disabled");
button.text("Desktop Coming Soon");

$("footer a").attr("target", "_blank");