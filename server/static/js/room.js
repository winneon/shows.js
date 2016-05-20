var width = 1280;
var height = 720;

var resizing = undefined;

function resize(animate){
	var video = $("div.video");
	var doc = $(document);

	var maxWidth = doc.width() - 100;
	var maxHeight = doc.height() - 161;

	var aspect = getAspectRatio(width, height, maxWidth, maxHeight);

	if (animate){
		if (resizing){
			window.clearTimeout(resizing);
			video.stop();

			resizing = undefined;
		}

		video.animate({
			width: aspect.width,
			height: aspect.height
		}, 150);

		resizing = setTimeout(() => resizing = undefined, 150);
	} else {
		video.width(aspect.width);
		video.height(aspect.height);
	}

}

$(window).on("resize", () => {
	resize(true);
});

resize(false);