/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js TypeScript implementation
*/

/// <reference path="enchant.d.ts" />
/// <reference path="debug.ts" />

class Screentip {
	private title: Label;
	private msg: Label;

	/**
	 * Screentip implements a ttile and message box.
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	 * @param {number} posX - X position for screentip.
	 * @param {number} posY - Y position for screentip.
	*/
	constructor(debug: boolean, posX: number, posY: number) {
		this.title = new Label('');
		this.msg = new Label('');
		this.title.color = 'rgb(255, 255, 255)';
		this.title.font = '10pt verdana, sans-serif';
		this.title.x = posX;
		this.title.y = posY;
		this.msg.color = this.title.color;
		this.msg.font = this.title.font;
		this.msg.x = posX - 45;
		this.msg.y = posY - 20;

		Debug.emit(debug, "Created screentip at ${posX},${posY}");
	}

	/**
	 * Emit a title and message.
	 * @param {string} title - Title to emit.
	 * @param {string} message - Message to emit.
	*/
	public emit(title: string, message: string): void {
		this.clear();
		this.title.text = title;
		this.msg.text = message;
	}

	/**
	 * Clear the screentip.
	*/
	public clear(): void {
		this.title.text = '';
		this.msg.text = '';
	}

	/**
	 * Draw the screentip.
	 * @returns {Label[]} The screentip.
	*/
	public draw(): Label[] {
		if (this.msg.text == null) this.msg.text = '';
		if (this.title.text == null) this.title.text = '';
		return [this.title, this.msg];
	}
}
