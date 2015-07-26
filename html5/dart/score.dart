/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:html';
import 'debug.dart';

class Score {
	bool debug;
	num posX;
	num posY;
	String score;

	/// Score implements a score or information box.
	/// [bool] debug Enable debug messages?
	/// [num] posX X position for score box.
	/// [num] posY Y position for score box.
	Score(bool debug, num posX, num posY) {
		this.debug = debug;
		this.posX = posX;
		this.posY = posY;
		this.score = "";
		Debug.emit(this.debug, "Created score counter at ${posX},${posY}"); // !
	}

	/// Emit a score or similar message.
	/// [dynamic] score Score or similar message to emit.
	void emit(dynamic score) {
		this.clear();
		this.score = score;
	}

	/// Clear the score box.
	void clear() {
		this.score = "";
	}

	/// Drawn the score box.
	void draw() {
		var canvas = document.getElementById("blackjack-table");
		var context = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.score.toString(), this.posX, this.posY);
	}
}
