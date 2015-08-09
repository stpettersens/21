/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js TypeScript implementation
*/

/// <reference path="enchant.d.ts" />
/// <reference path="debug.ts" />

class AI {
	private debug: boolean;
	private game: Core;
	private index: number;
	private pos: number;
	private cards: string[];
	private values: number[];

	/**
 	 * AI implements an artificial player (not the dealer).
 	 * @constructor
 	 * @param {boolean} debug - Enable debug messages?
 	 * @param {Core} game - Enchant.js game object.
	*/
	constructor(debug: boolean, game: Core) {
		this.debug = debug;
		this.game = game;
		this.index = 0;
		this.pos = 225;
		this.cards = [];
		this.values = [];
	}

	/**
 	 * Calculate the total value of AI's held cards.
 	 * @returns {number} Total value of AI's cards.
	*/
	public calcTotal(): number {
		this.values.sort(function(a: number, b: number) { return b - a });
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
	 * Determine if AI has Blackjack.
	 * @returns {boolean} Does AI have Blackjack?
	*/
	public hasBlackjack(): boolean {
		var blackjack: boolean = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, 'AI has Blackjack!');
			blackjack = true;
		}
		return blackjack;
	}

	/**
 	 * Determine if AI is bust.
 	 * @returns {boolean} Is AI bust?
	*/
	public isBust(): boolean {
		var bust: boolean = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, 'AI is bust!');
			bust = true;
		}
		return bust;
	}

	/**
 	 * Receive cards from dealer.
 	 * @param {string[]} ai_cards - AI's cards as string[].
 	 * @returns {Card[]} AI's cards as Card[].
	*/
	public receiveCards(ai_cards: string[]): Card[] {
		var ac: string = '';
		for (var i: number = 0; i < ai_cards.length; i++) {
			var cv: string[] = ai_cards[i].split(':');
			this.cards.push(cv[0]);
			this.values.push(parseInt(cv[1]));
		}
		ac = this.cards[0] + this.cards[1];
		Debug.emit(this.debug, '\nAI receives their cards:');
		Debug.emit(this.debug, "${ac} --> ${this.calcTotal()}");
		this.index++;
		var cardA = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);
		this.pos += 90;
		this.index++;
		var cardB = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);
		return [cardA, cardB];
	}

	/**
 	 * AI hits.
 	 * @param {Cards} cards - Game cards.
 	 * @returns {Card} AI's drawn card.
	*/
	private hit(cards: Cards): Card {
		var card: string = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		this.index++;
		this.pos += 90;
		Debug.emit(this.debug, 'AI hits.');
		Debug.emit(this.debug, "AI gets ${card}");
		Debug.emit(this.debug, "AI has ${calcTotal()}");
		return new Card(Card.getImage(card.match(/\[*(A-Za-z0-9+)\]*/)[0]), this.pos, 310, this.game);
	}

	/**
	 * AI stands.
	*/
	private stand(): void {
		Debug.emit(this.debug, 'AI stands.');
		Debug.emit(this.debug, "AI has #{this.calcTotal()}");
	}

	/**
 	 * AI responds to cards received or dealer.
 	 * @param {Cards} cards - Game cards.
 	 * @returns {Card[]} Response cards.
	*/
	public respond(cards: Cards): Card[] {
		this.showCards();
		var responding: boolean = true;
		var response_cards: Card[] = new Array<Card>();
		while(responding) {
			var total: number = 0;
			while(total <= 18) {
				total = this.calcTotal();
				if(total == 16) {
					if(Math.floor(Math.random() * 6) >= 3) {
						this.index++;
						this.pos += 90;
						response_cards.push(this.hit(cards)); // Take risk.
					}
					else
						this.stand(); // Play it safe.
				}
				else if(total >= 17) {
					this.stand();
					responding = false;
					break;
				}
				else {
					this.index++;
					this.pos += 90;
					response_cards.push(this.hit(cards));
				}
			}
		}
		return response_cards;
	}

	/**
	 * Show AI's cards.
	 * @returns {number} Total value of AI's cards.
	*/
	public showCards(): number {
		this.index = 0;
		this.pos = 225;
		var cards: string = '';
		for (var i: number = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.emit(this.debug, '\nAI has:');
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}
}
