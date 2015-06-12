/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="cards.ts"/>
/// <reference path="card.ts"/>
/// <reference path="debug.ts"/>

var debug: boolean = false;

class Dealer {
	private index: number;
	private pos: number;
	private cards: string[];
	private values: number[];

	constructor(debug: boolean) {
		debug = debug;
		this.index = 0;
		this.pos = 225;
		this.cards = new Array<string>();
		this.values = new Array<number>();
	}

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

	private hit(cards: Cards): Card {
		this.index++;
		this.pos += 90;
		var card: string = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		Debug.print(debug, "Dealer hits.");
		Debug.print(debug, "Dealer gets " + card);
		return new Card(Card_getImageData(card), this.pos, 10);
	}

	private stand(): void {
		Debug.print(debug, "Dealer stands.");
	}

	public shuffle(cards: Cards): void {
		if(cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
			Debug.print(debug, "-------------------------------------------------------");
			Debug.print(debug, "Dealer is shuffling cards...");
			Debug.print(debug, "-------------------------------------------------------");
			cards.shuffle();
		}
	}

	public deal(cards: Cards): string[] {
		var dealt: string[] = new Array<string>();
		var i: number = 1;
		Debug.print(debug, "-------------------------------------------------------");
		Debug.print(debug, "Dealer is dealing cards for a new game...");
		Debug.print(debug, "-------------------------------------------------------");
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
		Debug.print(debug, "\nDealer has:");
		Debug.print(debug, "[**]" + this.cards[1]);
		return [dealt[2], dealt[3]]
	}

	public hasBlackjack(): boolean {
		var blackjack: boolean = false;
		if(this.calcTotal() == 21) {
			Debug.print(debug, "Dealer has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	public isBust(): boolean {
		var bust: boolean = false;
		if(this.calcTotal() > 21) {
			Debug.print(debug, "Dealer is bust!");
			bust = true;
		}
		return bust;
	}

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

	public showCards(): number {
		this.index = 0;
		this.pos = 225;
		var cards: string = "";
		for(var i: number = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.print(debug, "\nDealer has:");
		Debug.print(debug, cards + " --> " + this.calcTotal().toString());
		return this.calcTotal();
	}

	public receiveCards(): Card[] {
		var cardA = new Card(Card_getImageData("c"), this.pos, 10);
		this.pos += 90;
		var cardB = new Card(Card_getImageData(this.cards[1]), this.pos, 10);
		this.index += 2;
		return [cardA, cardB];
	}

	public revealFirstCard(): Card {
		return new Card(Card_getImageData(this.cards[0]), 225, 10);
	}
}
