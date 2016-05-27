"use strict";

var youtubeDL = require("youtube-dl"),
    ffmpeg    = require("fluent-ffmpeg"),
    crypto    = require("crypto"),
    path      = require("path"),
    fs        = require("fs");

function Video(){ }

Video.prototype.downloadVideo = function(url, callback){
	var file = crypto.randomBytes(2).toString("hex");
	var dir = path.join(__dirname, "static", "video");
	var stream = path.join(dir, file) + ".mkv";

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	while (stream && fs.existsSync(stream + ".mkv")){
		file = crypto.randomBytes(2).toString("hex");
		stream = path.join(dir, file) + ".mkv";
	}

	var down = youtubeDL.exec(url, [ "--hls-prefer-ffmpeg", "-f", "bestvideo[vcodec^=avc][ext=mp4]+bestaudio[ext=m4a]/best", "--merge-output-format", "mkv", "-o", stream ], (error, output) => {
		if (error){
			console.log("An error occured downloading a video.");
			console.log(error);

			callback(error);
		} else {
			if (!fs.existsSync(stream)){
				stream = stream + ".mkv";
			}

			ffmpeg.ffprobe(stream, (error, metadata) => {
				var streams = metadata.streams;

				var videoStream = [ ];
				var audioStream = [ ];

				for (var i = 0; i < streams.length; i++){
					var obj = streams[i];

					if (obj.codec_type && obj.codec_type == "video"){
						videoStream = obj;
					}

					if (obj.codec_type && obj.codec_type == "audio"){
						audioStream = obj;
					}
				}

				var ext = "";

				var convert = {
					video: false,
					audio: false
				};

				if (videoStream.codec_name == "vp8" || videoStream.codec_name == "vp9"){
					ext = ".webm";
				}

				if (ext == ""){
					ext = ".mp4";
					convert.video = true;
				}

				if (audioStream.codec_name != "aac" && audioStream.codec_name != "vorbis"){
					convert.audio = true;
				}

				var converted = path.join(dir, file + ext);

				ffmpeg(stream)
					.videoCodec(convert.video ? "libx264" : "copy")
					.audioCodec(convert.audio ? "libfdk_aac" : "copy")
					.on("start", (cmdline) => {
						if (convert.video || convert.audio){
							console.log("Converting!");
						}
					})
					.on("end", () => {
						fs.unlinkSync(stream);
						callback(undefined, converted);
					})
					.on("error", (error) => {
						console.log("An error occured converting a video.")
						console.log(error);

						callback(error);
					})
					.save(converted);
			});
		}
	});
};

module.exports = new Video();