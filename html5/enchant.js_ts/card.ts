/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js TypeScript implementation
*/

/// <reference path="enchant.d.ts" />
/// <reference path="graphics.ts" />

class Card {
	private sprite: Sprite;
	private src: string;

	/**
	 * Card represents a single playing card.
	 * @constructor
	 * @param {string} card - Data URI for card graphic.
	 * @param {number} posX - X position for card.
	 * @param {number} posY - Y position for card.
	 * @param {Core} game - Enchant.js game object.
	*/
	constructor(card: string, posX: number, posY: number, game: Core) {
		this.sprite = new Sprite(71, 96);
		this.sprite.image = game.assets[card];
		this.sprite.x = posX;
		this.sprite.y = posY;
		this.src = card;
	}

	/** 
	 * Get image path from card string pattern.
	 * @static
	 * @param {string} card - Card string pattern.
	 * @returns {string} Path for card image.
	*/
	public static getImage(card: string) {
		if(card == 'c' || card == 'd')
			return g + card + '.png';

		var suit: string = '';
		if (new RegExp('(h)').test(card))
			suit = 'h';

		else if (new RegExp('(d)').test(card))
			suit = 'd';

		else if (new RegExp('(c)').test(card))
			suit = 'c';

		else if (new RegExp('(s)').test(card))
			suit = 's';

		var rank: string = card.match(/\[*([0-9A-Z]*)\]*/)[1];
		return "${g}${suit}${rank}.png";
	}

	/**
	 * Get source for image.
	 * @returns {string} Image source.
	*/
	public getImageSrc(): string {
		return this.src;
	}

	/**
	 * Set X, Y position for card.
	 * @param {number} posX - X position for card.
	 * @param {number} posY - Y position for card.
	*/
	public setXY(posX: number, posY: number): void {
		this.sprite.x = posX;
		this.sprite.y = posY;
	}

	/**
	 * Get X, Y position for card.
	 * @returns {number[]} X, Y position of card.
	*/
	public getXY(): number[] {
		return [this.sprite.x, this.sprite.y];
	}

	/**
	 * Draw the card.
	*/
	public draw(): Sprite {
		return this.sprite;
	}
}
