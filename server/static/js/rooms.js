"use strict";

var newRoomEvent = (event) => {
	var that = $(event.target);

	that.animate({
		opacity: 0
	}, 100, () => {
		that.replaceWith($("<input/>", {
			type: "text"
		}).addClass("new_room"));

		$("input.new_room").on("keydown", (event) => {
			if (event.which == 13 && $(event.target).val() != ""){
				dynamic_load("/connect/room/" + $(event.target).val().toLowerCase());
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

socket.on("get_rooms", (data) => {
	var $rooms = $("table.rooms");

	for (var room in data){
		var tr = $("<tr/>");

		var locked = $("<td/>");
		var name = $("<td/>");
		var host = $("<td/>");

		if (data[room].pass){
			locked.text("&#128274;");
		}

		name.append($("<span/>").text(data[room].name));
		host.text(data[room].host);

		tr.append(locked).append(name).append(host);
		$rooms.append(tr);
	}
});

socket.emit("get_rooms");