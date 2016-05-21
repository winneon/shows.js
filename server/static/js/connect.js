var path = window.location.pathname.replace(/\/+$/, "");

if (path == "/connect"){
	window.location.assign("/");
} else if (!socket){
	var socket = io($("span.hostname").text() + ":" + $("span.port").text());
}

socket.emit("service", $("span.service").text());
socket.on("finished", (data) => {
	if (data.valid){
		var message = "";

		if ($("div.message > div").text() != ""){
			message = "?message=" + $("div.message > div").text()
		}

		dynamic_load($("span.service").text() + message);
	} else {
		window.location.assign("/connect/rooms?message=" + data.message);
	}
});