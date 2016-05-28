// credit to https://github.com/mongodb-js/electron-squirrel-startup for the original code

var spawn = require("child_process").spawn,
    app	  = require("electron").app,
    path  = require("path");

var run = (args, done) => {
	var updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe");

	spawn(updateExe, args, {
		detached: true
	}).on("close", done);
};

var check = () => {
	if (process.platform == "win32") {
		var cmd = process.argv[1];
		
		var target = path.basename(process.execPath);

		if (cmd == "--squirrel-install" || cmd == "--squirrel-updated"){
			run(["--createShortcut=" + target + ""], app.quit);
			return true;
		}

		if (cmd == "--squirrel-uninstall"){
			run(["--removeShortcut=" + target + ""], app.quit);
			return true;
		}

		if (cmd == "--squirrel-obsolete"){
			app.quit();
			return true;
		}
	}

	return false;
};

module.exports = check();