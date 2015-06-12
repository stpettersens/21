/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

class Cards {
	private index: number;
	private deck_num: number;
	private deck: string[];
	private played: string[];
	private ranks: string[];
	private suits: string[];

	constructor() {
		this.index = -1;
		this.deck_num = 52;
		this.deck = new Array<string>();
		this.played = new Array<string>();
		this.ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
		this.suits = [ "h", "d", "c", "s" ];
	}

	private getRank(): string {
		var i: number = Math.floor(Math.random() * this.ranks.length);
		return this.ranks[i];
	}

	private getSuit(): string {
		var i: number = Math.floor(Math.random() * this.suits.length);
		return this.suits[i];
	}

	private getCard(): string {
		return this.getRank() + ' ' + this.getSuit();
	}

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

	public draw(): string {
		if(this.played.length == this.deck_num || this.index == -1) {
			this.index = 0;
		}
		this.played.push(this.deck[this.index]);
		var rs: string[] = this.deck[this.index].split(" ");
		return "[" + rs[0] + rs[1] + "]";	
	}

	public getValue(): number {
		var rs: string[] = this.deck[this.index].split(" ");
		this.index++;
		var value: number = 0;
		if(rs[0] == "A") value = 1;
		else if(rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") value = 10;
		else value = parseInt(rs[0]);
		return value;
	}

	public getPlayed(): number {
		return this.played.length;
	}

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
