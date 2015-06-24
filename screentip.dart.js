/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:html';
import 'debug.dart.js';

class Screentip {
	bool debug;
	num x;
	num y;
	String title;
	String msg;

	Screentip(bool debug, num x, num y) {
		this.debug = debug;
		this.x = x;
		this.y = y;
		this.title = "";
		this.msg = "";
		Debug.emit(this.debug, "Created screentip at ${this.x},${this.y}"); // !
	}

	void emit(String title, String message) {
		this.clear();
		this.title = title;
		this.msg = message;
	}

	void clear() {
		this.title = "";
		this.msg = "";
	}

	void draw() {
		if(this.msg == null) this.msg = "";
		if(this.title == null) this.title = "";
		var canvas = document.getElementById("blackjack-table");
		var context = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.title, this.x, this.y);
		context.fillText(this.msg, (this.x - 45), (this.y + 20));
	}
}
