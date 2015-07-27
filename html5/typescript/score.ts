/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="debug.ts" />

/**
 * @file Score class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/
class Score {
	private debug: boolean;
	private posX: number;
	private posY: number;
	private score: string;

	/**
	 * Score implements a score or information box.
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	 * @param {number} posX - X position for score box.
	 * @param {number} posY - Y position for score box.
	*/
	constructor(debug: boolean, posX: number, posY: number) {
		this.debug = debug;
		this.posX = posX;
		this.posY = posY;
		this.score = "";
		Debug.emit(this.debug, "Created score counter at ${posX},${posY}"); // !
	}

	/**
	 * Emit a score or similar message.
	 * @public
	 * @param {any} score - Score or similar messsage to emit.
	*/ 
	public emit(score: any): void {
		this.clear();
		this.score = score;
	}

	/**
	 * Clear the score box.
	 * @public
	*/
	public clear(): void {
		this.score = "";
	}

	/**
	 * Draw the score box.
	 * @public
	*/
	public draw(): void {
		var canvas: any = document.getElementById("blackjack-table");
		var context: any = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.score, this.posX, this.posY);
	}
}
