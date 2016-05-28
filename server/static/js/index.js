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

if (isElectron){
	$("a.login").on("click", (event) => {
		event.preventDefault();
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

		window.loadURL($(event.target).attr("href"));

		window.webContents.on("did-finish-load", (event) => {
			var url = window.webContents.getURL();

			if (url.indexOf("/electron_auth?code=") > -1){
				mainWindow.loadURL(url.replace("electron_auth", "authenticate") + "&electron=1");
				window.close();
			}
		});
	});
}