/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:html';
import 'debug.dart.js';

class Score {
	bool debug;
	num x;
	num y;
	String score;

	Score(bool debug, num x, num y) {
		this.debug = debug;
		this.x = x;
		this.y = y;
		this.score = "";
		Debug.emit(this.debug, "Created score counter at ${this.x},${this.y}"); // !
	}

	void emit(dynamic score) {
		this.clear();
		this.score = score;
	}

	void clear() {
		this.score = "";
	}

	void draw() {
		var canvas = document.getElementById("blackjack-table");
		var context = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.score.toString(), this.x, this.y);
	}
}
