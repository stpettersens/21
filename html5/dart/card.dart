/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:html';
import 'graphics.dart';

class Card {
	var image;
	int pos_x;
	int pos_y;

	/// Card represents a single playing card.
	/// [String] card Data URI for card graphic.
	/// [int] posX X position for card.
	/// [int] posY Y position for card.
	Card(String card, int pos_x, int pos_y) {
		this.image = new ImageElement();
		this.image.src = card;
		this.pos_x = pos_x;
		this.pos_y = pos_y;
	}

	/// Get an image path from card string pattern.
	/// [String] card String representation for card.
	/// Returns [String] Path to card graphic.
	static String getImage(String card) {

		if(card == "c" || card == "d") {
			return "gfx/${card}.png";
		}
		String suit = "";
		if(new RegExp("(h)").hasMatch(card)) {
			suit = "h";
		}
		else if(new RegExp("(d)").hasMatch(card)) {
			suit = "d";
		}
		else if(new RegExp("(c)").hasMatch(card)) {
			suit = "c";
		}
		else if(new RegExp("(s)").hasMatch(card)) {
			suit = "s";
		}
		String c = "";
		if(card.length == 2) c = card[0] + card[1];
		else if(card.length == 3) c = card[0] + card[1] + card[2];
		else if(card.length == 4) c = card[1] + card[2];
		else if(card.length == 5) c = card[1] + card[2] + card[3];
		String rank = new RegExp("([0-9A-Z]*)").stringMatch(c);
		return "gfx/${suit}${rank}.png";
	}

	/// Get an image data URI from card string pattern.
	/// [String] card String representation for card.
	/// Returns [String] Data URI for card graphic.
	static String getImageData(String card) {
		return graphics[gfx_fns.indexOf(Card.getImage(card))];
	}

	/// Get source for image.
	/// Returns [String] Image source.
	String getImageSrc() {
		return this.image.src;
	}

	/// Set X, Y position for card.
	/// [int] posX X position for card.
	/// [int] posY Y position for card.
	void setXY(int pos_x, int pos_y) {
		this.pos_x = pos_x;
		this.pos_y = pos_y;
	}

	/// Get X, Y position of card.
	/// Returns [List<int>] X, Y position of card.
	List<int> getXY() {
		return [this.pos_x, this.pos_y];
	}

	/// Draw the card.
	void draw() {
		var canvas = document.getElementById("blackjack-table");
		var context = canvas.getContext("2d");
		context.drawImage(this.image, this.pos_x, this.pos_y);
	}
}
