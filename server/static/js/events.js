socket.on("redirect", (url) => {
	window.location.assign(url);
});

socket.on("cookie", (options) => {
	if (!options.age){
		options.age = 999999999;
	}

	document.cookie = options.name + "=" + options.value + "; Max-Age=" + options.age + "; path=/";
});