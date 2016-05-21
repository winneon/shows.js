function loadTitle(){
	if ($("title").length > 0){
		$("title").remove();
	}

	$("head").prepend($("<title/>").text($("span.title").text()));
}

function dynamic_load(link){
	var $content = $("section.main");
	var $temp = $("section.content_temp");

	$content.find("section.content").fadeOut(200, () => {
		var message = "";

		if (link.indexOf("?message=") > -1){
			message = link.substring(link.indexOf("?message="), link.length);
			link = link.replace(message, "");
			message = message.replace("?message=", "");
		}

		$content.hide();
		$temp.load(link + " section.content", () => {
			window.history.pushState(null, null, link);

			if (link.startsWith("/room/")){
				link = "/room";
			}

			if (link.startsWith("/connect/")){
				link = "/connect";
			}

			loadCSS("/css" + link + ".css", $("link.current"));
			$content.html($temp.html());

			if (message != ""){
				showMessage(message);
			}

			$content.css("opacity", "0");
			$content.show(50, () => {
				loadJS("/js" + link + ".js", $("script.current"));

				$content.animate({
					opacity: "1"
				}, 200);
			});

			loadTitle();
		});
	});
}

function loadCSS(link, replace){
	var $element = $("head");

	var $new = $("<link/>", {
		"class": "current",
		type: "text/css",
		rel: "stylesheet",
		href: link
	});

	if (replace){
		$(replace).after($new);
		$(replace).remove();
	} else {
		$element.append($new);
	}
}

function loadJS(link, replace){
	var $element = $("body");

	var $new = $("<script/>", {
		"class": "current",
		type: "text/javascript",
		src: link
	});

	if (replace){
		$(replace).after($new);
		$(replace).remove();
	} else {
		$element.append($new);
	}
}

// credit to http://stackoverflow.com/a/14731922
function getAspectRatio(sourceWidth, sourceHeight, maxWidth, maxHeight){
	var ratio = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);

	return {
		width: sourceWidth * ratio,
		height: sourceHeight * ratio
	};
}

function showMessage(message){
	var $message = $("div.message");

	$message.find("> div").text(message);
	$message.css("opacity", "0");
	$message.addClass("show");

	$message.animate({
		opacity: 1
	}, 200, () => {
		$message.find("> div").on("click", (event) => {
			if (event.offsetY < 0){
				messageCallback();
			}
		});

		$(document).on("keydown", (event) => {
			if (event.which == 27){
				messageCallback();
			}
		});
	});
}

function messageCallback(){
	var $message = $("div.message");

	$message.animate({
		opacity: 0
	}, 200, () => {
		$message.removeClass("show");
		$message.css("opacity", "1");
		$message.find("> div").off("click");
		$(document).off("keydown");
	});
}

loadTitle();