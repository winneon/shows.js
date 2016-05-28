socket.on("redirect", (url) => {
	window.location.assign(url);
});

socket.on("electron-auth", (url, pathname) => {
	if (isElectron){
		var electron = require("electron").remote;
		var mainWindow = electron.getCurrentWindow();

		var window = new electron.BrowserWindow({
			title: "shows.js",
			width: 500,
			height: 600,
			resizable: false,
			frame: false,
			webPreferences: {
				nodeIntegration: false
			}
		});

		window.loadURL(url);

		window.webContents.on("did-finish-load", (event) => {
			var url = window.webContents.getURL();

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