/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js TypeScript implementation
*/

/// <reference path="enchant.d.ts" />
/// <reference path="debug.ts" />

class Score {
	private box: Label;

	/**
	 * Score implements a score or information box.
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	 * @param {number} posX - X position for score box.
	 * @param {number} posY - Y position for score box.
	*/
	constructor(debug: boolean, posX: number, posY: number) {
		this.box = new Label('');
		this.box.color = 'rgb(255, 255, 255)';
		this.box.font = '10pt verdana, sans-serif';
		this.box.x = posX;
		this.box.y = posY;
		this.box.width = 500;

		Debug.emit(debug, "Created score counter at ${posX},${posY}");
	}

	/**
	 * Emit a score or similar message.
	 * @param {any} score - Score or similar message to emit.
	*/
	public emit(score: any): void {
		this.clear();
		this.box.text = score.toString();
	}

	/**
	 * Clear the score box.
	*/
	public clear(): void {
		this.box.text = '';
	}

	/**
	 * Draw the score box.
	 * @returns {Label} The score box.
	*/
	public draw(): Label {
		return this.box;
	}
}
