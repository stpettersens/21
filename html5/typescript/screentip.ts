/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="debug.ts" />

/**
 * @file Screentip class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/
class Screentip {
	private debug: boolean;
	private posX: number;
	private posY: number;
	private title: string;
	private msg: string;

	/** 
	 * Screentip implements a title and message box.
	 * @public
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	 * @param {number} posX - X position for screentip.
	 * @param {number} posY - Y position for screentip.
	*/
 	constructor(debug: boolean, posX: number, posY: number) {
		this.debug = debug;
		this.posX = posX;
		this.posY = posY;
		this.title = "";
		this.msg = "";
		Debug.emit(this.debug, "Created screentip at ${posX},${posY}"); // !
	}

	/**
	 * Emit a title and message.
	 * @public
	 * @param {string} title - Title to emit.
	 * @param {string} message - Message to emit.
	*/
	public emit(title: string, message: string): void {
		this.clear();
		this.title = title;
		this.msg = message;
	}

	/**
	 * Clear the screentip.
	 * @public
	*/
	public clear(): void {
		this.title = "";
		this.msg = "";
	}

	/**
	 * Draw the screentip.
	 * @public
	*/
	public draw(): void {
		if(this.msg == null) this.msg = "";
		if(this.title == null) this.title = "";
		var canvas: any = document.getElementById("blackjack-table");
		var context: any = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.title, this.posX, this.posY);
		context.fillText(this.msg, (this.posX - 45), (this.posY + 20));
	}
}
