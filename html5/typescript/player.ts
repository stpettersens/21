/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.

	HTML5/TypeScript implementation
*/

/// <reference path="cards.ts" />
/// <reference path="card.ts" />
/// <reference path="debug.ts" />

/**
 * @file Player class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/
class Player {
	private debug: boolean;
	private index: number;
	private pos: number;
	private cards: string[];
	private values: number[];

	/**
	 * Player implements the player for Blackjack.
	 * @public
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	*/
	constructor(debug: boolean) {
		this.debug = debug;
		this.index = -1;
		this.pos = 225;
		this.cards = new Array<string>();
		this.values = new Array<number>();
	}

	/**
	 * Calculate the total value of player's held cards.
	 * @public
	 * @returns {number} Total value for player's cards.
	*/ 		
	public calcTotal(): number {
		this.values.sort(function(a, b) { return b - a });
		var total: number = 0;
		for(var i: number = 0; i < this.values.length; i++) {
			var v: number = this.values[i];
			if(v == 1) {
				if((total + 11) <= 21) v = 11;
				if((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	/**
	 * Determine if player has Blackjack.
	 * @public
	 * @returns {boolean} Does player have Blackjack?
	*/
	public hasBlackjack(): boolean {
		var blackjack: boolean = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, "Player has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	/**
	 * Determine if player is bust.
	 * @public
	 * @returns {boolean} Is player bust?
	*/
	public isBust(): boolean {
		var bust: boolean = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, "Player is bust!");
			bust = true;
		}
		return bust;
	}

	/**
	 * Receive cards from dealer.
	 * @public
	 * @param {string[]} Player's cards as string[].
	 * @returns {Card[]} Player's cards as Card[].
	*/
	public receiveCards(player_cards: string[]): Card[] {
		var pc: string = "";
		for(var i: number = 0; i < player_cards.length; i++) {
			var cv: string[] = player_cards[i].split(":");
			this.cards.push(cv[0]);
			this.values.push(parseInt(cv[1]));
		}
		pc = this.cards[0] + this.cards[1];
		Debug.emit(this.debug, "\nPlayer receives their cards:");
		Debug.emit(this.debug, pc + " --> " + this.calcTotal().toString())

		this.index++;
		var cardA = new Card(Card.getImageData(this.cards[this.index]), this.pos, 310);
		this.pos += 90;
		this.index ++;
		var cardB = new Card(Card.getImageData(this.cards[this.index]), this.pos, 310);
		return [cardA, cardB];
	}

	/**
	 * Player hits.
	 * @public
	 * @param {Cards} cards - Game cards.
	 * @returns {Card} Player's drawn card.
	*/
	public hit(cards: Cards): Card {
		var card: string = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		this.index++;
		this.pos += 90;
		Debug.emit(this.debug, "Player hits.");
		Debug.emit(this.debug, "Player gets " + card);
		Debug.emit(this.debug, "Player has " + this.calcTotal().toString());
		return new Card(Card.getImageData(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), this.pos, 310);
	}

	/**
	 * Player stands.
	 * @public
	*/
	public stand(): void {
		Debug.emit(this.debug, "Player stands.");
		Debug.emit(this.debug, "Player has " + this.calcTotal().toString());
	}

	/**
	 * Show player's cards.
	 * @public
	 * @returns {number} Total value of player's cards.
	*/
	public showCards(): number {
		this.index = 0;
		this.pos = 225;
		var cards: string = "";
		for(var i: number = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.emit(this.debug, "\nPlayer has:");
		Debug.emit(this.debug, cards + " --> " + this.calcTotal().toString());
		return this.calcTotal();
	}
}
