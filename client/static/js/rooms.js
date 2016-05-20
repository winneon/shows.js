"use strict";

var client = undefined;

var newRoomEvent = (event) => {
	var that = $(event.target);

	that.animate({
		opacity: 0
	}, 100, () => {
		that.replaceWith($("<input/>", {
			type: "text"
		}).addClass("new_room"));

		$("input.new_room").on("keydown", (event) => {
			if (event.which == 13){
				client = require("./js/node/client");
			}
		});

		$("input.new_room").focus();
	});
};

$("table.rooms td > span:not(.new_room)").on("click", function(){ });
$("span.new_room").on("click", newRoomEvent);

$(document).on("click", (event) => {
	if (!$(event.target).hasClass("new_room") && $("span.new_room").length == 0){
		$(".new_room").replaceWith($("<span/>").addClass("new_room").text("new_room").css("opacity", "0"));

		$("span.new_room").animate({
			opacity: 1
		}, 100, () => $(".new_room").on("click", newRoomEvent));
	}
});