socket.on("redirect", (url) => {
	window.location.assign(url);
});

socket.on("electron-auth", (url, pathname) => {
	if (isElectron){
		var electron = require("electron").remote;
		var mainWindow = electron.getCurrentWindow();

		var window = new electron.BrowserWindow({
			title: "shows.js",
			width: 1000,
			height: 600,
			resizable: false,
			frame: false,
			show: false,
			backgroundColor: "#282b30",
			webPreferences: {
				nodeIntegration: false
			}
		});

		window.loadURL(url);

		window.webContents.on("did-get-redirect-request", (event) => {
			console.log(window.webContents.getURL());
		});

		window.webContents.on("did-finish-load", (event) => {
			var url = window.webContents.getURL();
			window.show();

			if (url.indexOf("https://discordapp.com/oauth2/authorize") == 0){
				window.webContents.executeJavaScript(`var interval = setInterval(() => {
					if (document.getElementsByTagName("footer").length > 0){
						clearInterval(interval);

						var button = document.createElement("button");
						var text = document.createTextNode("Logout");

						button.setAttribute("type", "button");
						button.appendChild(text);

						button.addEventListener("click", (event) => {
							localStorage.removeItem("token");
							window.location.reload();
						});

						var footer = document.getElementsByTagName("footer")[0];
						footer.insertBefore(button, footer.childNodes[0]);
					}
				}, 50);`);
			}

			if (url.indexOf("/electron_auth?code=") > -1){
				mainWindow.loadURL(url.replace("electron_auth", "authenticate") + "&electron=1&next=" + pathname);
				window.close();
			}
		});
	}
});

socket.on("cookie", (options) => {
	if (!options.age){
		options.age = 999999999;
	}

	document.cookie = options.name + "=" + options.value + "; Max-Age=" + options.age + "; path=/";
});