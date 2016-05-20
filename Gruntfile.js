"use strict";

module.exports = (grunt) => {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		installdeps: {
			client: "client/",
			server: "server/"
		},
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			both: [ "client", "server" ]
		},
		sass: {
			client: {
				options: {
					sourcemap: "none",
					style: "compact"
				},
				files: [{
					expand: true,
					cwd: "<%= installdeps.client %>sass/",
					src: [ "**/*.scss" ],
					dest: "<%= installdeps.client %>static/css/",
					ext: ".css"
				}]
			},
			server: {
				options: {
					sourcemap: "none",
					style: "compact"
				},
				files: [{
					expand: true,
					cwd: "<%= installdeps.server %>sass/",
					src: [ "**/*.scss" ],
					dest: "<%= installdeps.server %>static/css/",
					ext: ".css"
				}]
			},
		},
		watch: {
			client: {
				files: "<%= installdeps.client %>sass/**/*.scss",
				tasks: [ "sass:client" ]
			},
			server: {
				files: "<%= installdeps.server %>sass/**/*.scss",
				tasks: [ "sass:server" ]
			}
		}
	});

	require("matchdep").filter("grunt-*").forEach(grunt.loadNpmTasks);
	
	grunt.registerTask("client", "Watch the client folder.", () => {
		grunt.task.run("sass:client");
		grunt.task.run("watch:client")
	});

	grunt.registerTask("server", "Watch the server folder.", () => {
		grunt.task.run("sass:server");
		grunt.task.run("watch:server")
	});

	grunt.registerTask("installdeps", "Install dependencies", (target) => {
		var run = (dir) => {
			require("child_process").execSync("npm install", {
				cwd: dir,
				stdio: [ 0, 1, 2 ]
			});
		};

		if (target){
			var dir = grunt.config.get("installdeps." + target);

			if (dir){
				run(dir);
			}
		} else {
			var obj = grunt.config.get("installdeps");

			for (var dir in obj){
				run(obj[dir]);
			}
		}
	});

	grunt.registerTask("build", "Build the executables.", (target) => {
		var platform = [ ];
		var cmd = "node_modules/.bin/build --dist --platform ";

		if (process.platform == "win32"){
			cmd = cmd.replace(/\//g, "\\");
		}

		if (target){
			platform = [ target ];
		} else {
			if (process.platform == "win32"){
				platform = [ "win32" ];
			} else {
				platform = [ "win32", "darwin", "linux" ];
			}
		}

		for (var i = 0; i < platform.length; i++){
			require("child_process").execSync(cmd + platform[i], {
				cwd: grunt.config.get("installdeps.client"),
				stdio: [ 0, 1, 2 ]
			});

			var client = grunt.config.get("installdeps.client");
			var server = grunt.config.get("installdeps.server");

			require("fs").mkdir(server + "static/dist/");

			var pack = grunt.file.readJSON(client + "package.json");

			switch (platform[i]){
				case "win32":
					require("fs").renameSync(
						client + "dist/win/" + pack.productName + " Setup " + pack.version + ".exe",
						server + "static/dist/" + platform[i] + ".exe"
					);

					break;
			}
		}
	});

	grunt.registerTask("default", [ "concurrent:both" ]);
};