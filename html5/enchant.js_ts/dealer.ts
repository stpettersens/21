/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js TypeScript implementation
*/

/// <reference path="enchant.d.ts" />
/// <reference path="sounds.ts" />
/// <reference path="card.ts" />
/// <reference path="cards.ts" />
/// <reference path="debug.ts" />

class Dealer {
	private debug: boolean;
	private game: Core;
	private index: number;
	private pos: number;
	private cards: string[];
	private values: number[];

	/**
	 * Dealer implements the dealer for Blackjack.
	 * @constructor
	 * @param {boolean} debug - Enable debug messages?
	 * @param {Core} game - Enchant.js game object.
	*/
	constructor(debug: boolean, game: Core) {
		this.debug = debug;
		this.game = game;
		this.index = 0;
		this.pos = 225;
		this.cards = new Array<string>();
		this.values = new Array<number>();
	}

	/**
	 * Calculate the total value of dealer's held cards.
	 * @returns {number} Total value of dealer's cards.
	*/
	public calcTotal(): number {
		this.values.sort(function(a: number, b: number) { return b - a });
		var total: number = 0;
		for (var i: number = 0; i < this.values.length; i++) {
			var v: number = this.values[i];
			if(v == 1) {
				if ((total + 11) <= 21) v = 11;
				else if ((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	/**
	 * Dealer hits.
	 * @param {Cards} cards - Game cards.
	 * @returns {Card} Dealer's drawn card.
	*/
	private hit(cards: Cards): Card {
		this.index++;
		this.pos += 90;
		var card: string = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		Debug.emit(this.debug, 'Dealer hits.');
		Debug.emit(this.debug, "Dealer gets ${card}");
		return new Card(Card.getImage(card), this.pos, 10, this.game);
	}

	/**
	 * Dealer stands.
	*/
	private stand(): void {
		Debug.emit(this.debug, 'Dealer stands.');
	}

	/**
	 * Dealer shuffles.
	 * @param {Cards} cards - Game cards to shuffle.
	*/
	public shuffle(cards: Cards): void {
		if (cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
			SoundEffects.play(this.game, 'shuffle');
			Debug.emit(this.debug, '-------------------------------------------------------');
			Debug.emit(this.debug, 'Dealer is shuffling cards...');
			Debug.emit(this.debug, '-------------------------------------------------------');
			cards.shuffle();
		} 
	}

	/**
	 * Dealer deals.
	 * @param {Cards} cards - Game cards.
	 * @returns {string[]} Player's cards.
	*/
	public deal(cards: Cards): string[] {
		SoundEffects.play(this.game, 'deal');
		var dealt: string[] = new Array<string>();
		var i: number = 1;
		Debug.emit(this.debug, '-------------------------------------------------------');
		Debug.emit(this.debug, 'Dealer is dealing cards for a new game...');
		Debug.emit(this.debug, '-------------------------------------------------------');
		while(i <= (2 * 2)) {
			dealt.push("${cards.draw()}:${cards.getValue()}");
			i++;
		}
		i = 0;
		while(i < 2) {
			var cv: string[] = dealt[i].split(':');
			this.cards.push(cv[0]);
			this.values.push(parseInt(cv[1]));
			i++;
		}
		Debug.emit(this.debug, '\nDealer has:');
		Debug.emit(this.debug, '[**]${this.cards[1]}');
		return [dealt[2], dealt[3]];
	}

	/**
	 * Determine if dealer has Blackjack.
	 * @returns {boolean} Does dealer have Blackjack?
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
	 * Determien if dealer is bust.
	 * @returns {boolean} Is dealer bust?
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
	 * Dealer responds to player action (e.g. a hit or stand).
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
				if (total == 16) {
					if (Math.floor(Math.random() * 6) >= 3)
						response_cards.push(this.hit(cards)); // Take risk.
					else
						this.stand(); // Play it safe.
				}
				else if (total >= 17) {
					this.stand();
					responding = false;
					break;
				}
				else
					response_cards.push(this.hit(cards));
			}
		}
		return response_cards;
	}

	/**
	 * Show dealer's cards.
	 * @returns {number} Total value of dealer's cards.
	*/
	public showCards(): number {
		this.index = 0;
		this.pos = 225;
		var cards: string = '';
		for (var i = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.emit(this.debug, '\nDealer has:');
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}

	/**
	 * Dealer receives cards.
	 * @returns {Card[]} Dealer's received cards.
	*/
	public receiveCards(): Card[] {
		this.index++;
		var cardA = new Card(Card.getImage('c'), this.pos, 10, this.game);
		this.index++;
		this.pos += 90;
		var cardB = new Card(Card.getImage(this.cards[1]), this.pos, 10, this.game);
		return [cardA, cardB];
	}

	/**
	 * Dealer reveals first card.
	 * @returns {Card} Revealed first card.
	*/
	public revealFirstCard(): Card {
		SoundEffects.play(this.game, 'reveal');
		return new Card(Card.getImage(this.cards[0]), 225, 10, this.game);
	}
}
