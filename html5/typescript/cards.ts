/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/**
 * @file Cards class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/
class Cards {
	private index: number;
	private deck_num: number;
	private deck: string[];
	private played: string[];
	private ranks: string[];
	private suits: string[];

	/**
	 * Cards implements a collection of playing cards
	 * and methods to draw and shuffle.
	 * @constructor
	*/
	constructor() {
		this.index = -1;
		this.deck_num = 52;
		this.deck = new Array<string>();
		this.played = new Array<string>();
		this.ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
		this.suits = [ "h", "d", "c", "s" ];
	}

	/**
	 * Get a rank for a card.
	 * @private
	 * @returns {string} Card rank.
	*/
	private getRank(): string {
		var i: number = Math.floor(Math.random() * this.ranks.length);
		return this.ranks[i];
	}

	/**
	 * Get a suit for a card.
	 * @private
	 * @returns {string} Card suit.
	*/
	private getSuit(): string {
		var i: number = Math.floor(Math.random() * this.suits.length);
		return this.suits[i];
	}

	/**
	 * Get a card.
	 * @private
	 * @returns {string} Card as string.
	*/
	private getCard(): string {
		return "${this.getRank()} ${this.getSuit()}";
	}

	/**
	 * Shuffle cards.
	 * @public
	*/
	public shuffle(): void {
		this.index = - 1;
		this.deck = new Array<string>();
		this.played = new Array<string>();
		while(true) {
			var card: string = this.getCard();
			if(this.deck.indexOf(card) == -1) {
				this.deck.push(card);
				if(this.deck.length == this.deck_num) {
					break;
				}
			}
		}
	}

	/**
	 * Draw a card.
	 * @public
	 * @returns {string} Drawn card as string.
	*/
	public draw(): string {
		if(this.played.length == this.deck_num || this.index == -1) {
			this.index = 0;
		}
		this.played.push(this.deck[this.index]);
		var rs: string[] = this.deck[this.index].split(" ");
		return "[" + rs[0] + rs[1] + "]";	
	}

	/**
	 * Get a card's value.
	 * @public
	 * @returns {number} Card's value.
	*/
	public getValue(): number {
		var rs: string[] = this.deck[this.index].split(" ");
		this.index++;
		var value: number = 0;
		if(rs[0] == "A") value = 1;
		else if(rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") value = 10;
		else value = parseInt(rs[0]);
		return value;
	}

	/**
	 * Get number of played cards.
	 * @public
	 * @returns {number} Number of cards played.
	*/
	public getPlayed(): number {
		return this.played.length;
	}

	/**
	 * Draw all the cards from the deck.
	 * @public
	 * @returns {string[]} All cards from deck.
	*/
	public drawAll(): string[] {
		this.index = 0;
		var draws: string[] = new Array<string>();
		for(var i: number = 0; i < this.deck_num; i++) {
			var d: string = this.draw();
			draws.push(d);
			this.index++;
		}
		this.index = -1;
		return draws;
	}
}
