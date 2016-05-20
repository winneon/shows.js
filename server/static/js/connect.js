function finished(){
	dynamic_load($("span.service").text());
}

var path = window.location.pathname.replace(/\/+$/, "");

if (path == "/connect"){
	window.location.assign("/");
} else if (!socket){
	var socket = io($("span.hostname").text() + ":" + $("span.port").text());
}

socket.emit("service", $("span.service").text());
socket.on("finished", finished);