/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js TypeScript implementation
*/

/// <reference path="enchant.d.ts" />
/// <reference path="card.ts" />
/// <reference path="cards.ts" />
/// <reference path="debug.ts" />

class Player {
	private debug: boolean;
	private game: Core;
	private index: number;
	private pos: number;
	private cards: string[];
	private values: number[];

	/**
	 * Player implements the player for Blackjack.
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	 * @param {Core} game - Enchant.js game object.
	*/
	constructor(debug: boolean, game: Core) {
		this.debug = debug;
		this.game = game;
		this.index = -1;
		this.pos = 225;
		this.cards = new Array<string>();
		this.values = new Array<number>();
	}

	/**
	 * Calculate the total value of player's held cards.
	 * @returns {number} Total value of player's cards.
	*/
	public calcTotal(): number {
		this.values.sort(function(a: number, b: number) { return b - a });
		var total: number = 0;
		for (var i = 0; i < this.values.length; i++) {
			var v: number = this.values[i];
			if(v == 1) {
				if ((total + 11) <= 21) v = 11;
				if ((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	/**
	 * Determine if player has Blackjack.
	 * @returns {boolean} Does player have Blackjack?
	*/
	public hasBlackjack(): boolean {
		var blackjack: boolean = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, 'Dealer has Blackjack!');
			blackjack = true;
		}
		return blackjack;
	}

	/**
	 * Determine if player is bust.
	 * @returns {boolean} Is player bust?
	*/
	public isBust(): boolean {
		var bust: boolean = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, 'Dealer is bust!');
			bust = true;
		}
		return bust;
	}

	/**
	 * Receive cards from dealer.
	 * @param {string[]} player_cards - Player's cards as string[].
	 * @returns {Card[]} Player's cards as Card[].
	*/
	public receiveCards(player_cards: string[]): Card[] {
		var pc: string = '';
		for (var i: number = 0; i < player_cards.length; i++) {
			var cv: string[] = player_cards[i].split(':');
			this.cards.push(cv[0]);
			this.values.push(parseInt(cv[1]));
		}
		pc = this.cards[0] + this.cards[1];
		Debug.emit(this.debug, '\nPlayer receives their cards:');
		Debug.emit(this.debug, "${pc} --> ${this.calcTotal()}");

		this.index++;
		var cardA = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);

		this.index++;
		this.pos += 90;
		var cardB = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);
		return [cardA, cardB];
	}

	/**
	 * Player hits.
	 * @param {Cards} cards - Game cards.
	 * @returns {Card} Player's drawn card.
	*/
	public hit(cards: Cards): Card {
		var card: string = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		this.index++;
		this.pos += 90;
		Debug.emit(this.debug, 'Player hits.');
		Debug.emit(this.debug, "Player gets ${card}");
		Debug.emit(this.debug, "Player has ${this.calcTotal()}");
		return new Card(Card.getImage(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), this.pos, 310, this.game);
	}

	/** 
	 * Player stands.
	*/
	public stand(): void {
		Debug.emit(this.debug, 'Player stands.');
		Debug.emit(this.debug, "Player has ${this.calcTotal()}");
	}

	/**
	 * Show player's cards.
	 * @returns {number} Total value of player's cards.
	*/
	public showCards(): number {
		this.index = 0;
		this.pos = 225;
		var cards: string = '';
		for (var i: number = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.emit(this.debug, '\nPlayer has:');
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}
}
