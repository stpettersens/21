/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:html';
import 'debug.dart';

class Screentip {
	bool debug;
	num posX;
	num posY;
	String title;
	String msg;

	/// Screentip implements a title and message box.
	/// [bool] debug Enable debug message?
	/// [num] posX X position for screentip.
	/// [num] posY Y position for screentip.
	Screentip(bool debug, num posX, num posY) {
		this.debug = debug;
		this.posX = posX;
		this.posY = posY;
		this.title = "";
		this.msg = "";
		Debug.emit(this.debug, "Created screentip at ${posX},${posY}"); // !
	}

	/// Emit a title and message.
	/// [String] title Title to emit.
	/// [String] message Message to emit.
	void emit(String title, String message) {
		this.clear();
		this.title = title;
		this.msg = message;
	}

	/// Clear the screentip.
	void clear() {
		this.title = "";
		this.msg = "";
	}

	/// Draw the screentip.
	void draw() {
		if(this.msg == null) this.msg = "";
		if(this.title == null) this.title = "";
		var canvas = document.getElementById("blackjack-table");
		var context = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.title, this.posX, this.posY);
		context.fillText(this.msg, (this.posX - 45), (this.posY + 20));
	}
}
