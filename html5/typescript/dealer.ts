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
 * @file Dealer class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/
class Dealer {
	private debug: boolean;
	private index: number;
	private pos: number;
	private cards: string[];
	private values: number[];

	/**
	 * Dealer implements the dealer for Blackjack.
	 * @public
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	*/
	constructor(debug: boolean) {
		this.debug = debug;
		this.index = 0;
		this.pos = 225;
		this.cards = new Array<string>();
		this.values = new Array<number>();
	}

	/**
	 * Calculate the total value of dealer's held cards.
	 * @public
	 * @returns {number} Total value of dealer's cards.
	*/
	public calcTotal(): number {
		this.values.sort(function(a, b) { return b - a });
		var total: number = 0;
		for(var i: number = 0; i < this.values.length; i++) {
			var v: number = this.values[i];
			if(v == 1) {
				if((total + 11) <= 21) v = 11;
				else if((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	/**
	 * Dealer hits.
	 * @private
	 * @param {Cards} cards - Game cards.
	 * @returns {Card} Dealer's drawn card.
	*/
	private hit(cards: Cards): Card {
		this.index++;
		this.pos += 90;
		var card: string = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		Debug.emit(this.debug, "Dealer hits.");
		Debug.emit(this.debug, "Dealer gets ${card}");
		return new Card(Card.getImageData(card), this.pos, 10);
	}

	/**
	 * Dealer stands.
	 * @private
	*/
	private stand(): void {
		Debug.emit(this.debug, "Dealer stands.");
	}

	/**
	 * Dealer shuffles.
	 * @public
	 * @param {Cards} cards - Game cards to shuffle.
	*/
	public shuffle(cards: Cards): void {
		if(cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
			Debug.emit(this.debug, "-------------------------------------------------------");
			Debug.emit(this.debug, "Dealer is shuffling cards...");
			Debug.emit(this.debug, "-------------------------------------------------------");
			cards.shuffle();
		}
	}

	/**
	 * Dealer deals.
	 * @public
	 * @param {Cards} cards - Game cards.
	 * @returns {string[]} Player's cards.
	*/
	public deal(cards: Cards): string[] {
		var dealt: string[] = new Array<string>();
		var i: number = 1;
		Debug.emit(this.debug, "-------------------------------------------------------");
		Debug.emit(this.debug, "Dealer is dealing cards for a new game...");
		Debug.emit(this.debug, "-------------------------------------------------------");
		while(i <= (2 * 2)) {
			dealt.push(cards.draw() + ":" + cards.getValue());
			i++;
		}
		i = 0;
		while(i < 2) {
			var cv: string[] = dealt[i].split(":");
			this.cards.push(cv[0]);
			this.values.push(parseInt(cv[1]));
			i++;
		}
		Debug.emit(this.debug, "\nDealer has:");
		Debug.emit(this.debug, "[**]${this.cards[1]}");
		return [dealt[2], dealt[3]]
	}

	/**
	 * Determine if dealer has Blackjack.
	 * @public
	 * @returns {boolean} Does dealer have Blackjack?
	*/
	public hasBlackjack(): boolean {
		var blackjack: boolean = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, "Dealer has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	/**
	 * Determine if dealer is bust.
	 * @public
	 * @returns {boolean} Is dealer bust?
	*/
	public isBust(): boolean {
		var bust: boolean = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, "Dealer is bust!");
			bust = true;
		}
		return bust;
	}

	/**
	 * Dealer reponds to player action (e.g. a hit or stand).
	 * @public
	 * @param {Cards} cards - Game cards.
	 * @returns {Card[]} Cards returned.
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
						response_cards.push(this.hit(cards)); // Take risk.
					}
					else {
						this.stand(); // Play it safe.
					}
				}
				else if(total >= 17) {
					this.stand();
					responding = false;
					break;
				}
				else {
					response_cards.push(this.hit(cards));
				}
			}
		}
		return response_cards;
	}

	/**
	 * Show dealer's cards.
	 * @public
	 * @returns {number} Total value of dealer's cards.
	*/
	public showCards(): number {
		this.index = 0;
		this.pos = 225;
		var cards: string = "";
		for(var i: number = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.emit(this.debug, "\nDealer has:");
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}

	/**
	 * Dealer receives cards.
	 * @public
	 * @returns {Card[]} Dealer's received cards.
	*/ 
	public receiveCards(): Card[] {
		var cardA = new Card(Card.getImageData("c"), this.pos, 10);
		this.pos += 90;
		var cardB = new Card(Card.getImageData(this.cards[1]), this.pos, 10);
		this.index += 2;
		return [cardA, cardB];
	}

	/**
	 * Dealer reveals first card.
	 * @public
	 * @returns {Card} Revealed first card.
	*/
	public revealFirstCard(): Card {
		return new Card(Card.getImageData(this.cards[0]), 225, 10);
	}
}
