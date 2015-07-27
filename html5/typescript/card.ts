/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="graphics.ts" />

/**
 * @file Card class for Blackjack.
 * @copyright 2015 Sam-Pettersen
*/
class Card {
	private image: any;
	private posX: number;
	private posY: number;

	/**
	 * Card represents a single playing card.
	 * @constructor
	 * @param {string} card - Data URI for card graphic.
	 * @param {number} posX - X position for card.
	 * @param {number} posY - Y position for card.
	*/
	constructor(card: string, posX: number, posY: number) {
		this.image = new Image();
		this.image.src = card;
		this.posX = posX;
		this.posY = posY;
	}
	
	/**
	 * Get an image path from card string pattern.
	 * @public
	 * @static
	 * @param {string} card - String representation for card.
	 * @returns {string} Path to card graphic.
	*/
	public static getImage(card: string): string {
		if(card == "c" || card == "d") {
			return "gfx/" + card + ".png";
		}
		var suit: string = "";
		if(/(h)/.test(card)) {
			suit = "h";
		}
		else if(/(d)/.test(card)) {
			suit = "d";
		}
		else if(/(c)/.test(card)) {
			suit = "c";
		}
		else if(/(s)/.test(card)) {
			suit = "s";
		}
		var rank: string = card.match(/\[*([0-9A-Z]*)\]*/)[1];
		return "gfx/${suit}${rank}.png";
	}
	
	/**
	 * Get an image data URI from card string pattern.
	 * @public
	 * @static
	 * @param {string} card - String representation for card.
	 * @returns {string} Data URI for card graphic.
	*/
	public static getImageData(card: string): string {
		return graphics[gfx_fns.indexOf(Card.getImage(card))];
	}

	/**
	 * Get source for image.
	 * @public
	 * @returns {string} Image source.
	*/
	public getImageSrc(): string {
		return this.image.src;
	}
	
	/**
	 * Set X, Y position for card.
	 * @public
	 * @param {number} posX - X position for card.
	 * @param {number} posY - Y position for card.
	*/
	public setXY(posX: number, posY: number): void {
		this.posX = posX;
		this.posY = posY;
	}

	/**
	 * Get X, Y position of card.
	 * @public
	 * @returns {number[]} X, Y position of card.
	*/
	public getXY(): number[] {
		return [this.posX, this.posY];
	}

	/**
	 * Draw the card.
	 * @public
	*/
	public draw(): void {
		var canvas: any = document.getElementById("blackjack-table");
		var context: any = canvas.getContext("2d");
		context.drawImage(this.image, this.posX, this.posY, this.image.width, this.image.height);
	}
}
