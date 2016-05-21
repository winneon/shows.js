"use strict";

var newRoomEvent = (event) => {
	var that = $(event.target);

	that.animate({
		opacity: 0
	}, 100, () => {
		that.replaceWith($("<input/>", {
			type: "text",
			maxlength: 20
		}).addClass("new_room"));

		$("input.new_room").on("keydown", (event) => {
			if (event.which != 16 &&
				event.which != 17 &&
				event.which != 18 &&
				event.which != 91 &&
				event.which != 8 &&
				event.which != 27){
				if (/^[a-z]+$/i.test(String.fromCharCode(event.which)) || event.which == 13){
					if ($(event.target).val() != ""){
						if (/^[a-z]+$/i.test($(event.target).val())){
							if (event.which == 13){
								event.preventDefault();
								dynamic_load("/connect/room/" + $(event.target).val().toLowerCase());
							}
						} else {
							event.preventDefault();
							showMessage("Room names must only have letters.");
						}
					}
				} else {
					event.preventDefault();
					showMessage("Room names must only have letters.");
				}
			}
		});

		$("input.new_room").focus();
	});
};

$("span.new_room").on("click", newRoomEvent);

$(document).on("click", (event) => {
	if (!$(event.target).hasClass("new_room") &&
		!$(event.target).hasClass("div.message") &&
		!$(event.target).parents("div.message").length &&
		$("span.new_room").length == 0){
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

		name.append($("<span/>").addClass("room").text(data[room].name));
		host.text(data[room].host);

		tr.append(locked).append(name).append(host);
		$rooms.append(tr);

		$("span.room").on("click", function(event){
			dynamic_load("/connect/room/" + $(event.target).text().toLowerCase());
		});
	}
});

socket.emit("get_rooms");