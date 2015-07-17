/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="graphics.ts"/>

class Card {
	private image: any;
	private pos_x: number;
	private pos_y: number;

	constructor(card: string, pos_x: number, pos_y: number) {
		this.image = new Image();
		this.image.src = card;
		this.pos_x = pos_x;
		this.pos_y = pos_y;
	}
	
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
	
	public static getImageData(card: string): string {
		return graphics[gfx_fns.indexOf(Card.getImage(card))];
	}

	/*
	public getImage(): string {
		return this.image.src;
	}
	*/

	public setXY(pos_x: number, pos_y: number): void {
		this.pos_x = pos_x;
		this.pos_y = pos_y;
	}

	public getXY(): number[] {
		return [this.pos_x, this.pos_y];
	}

	public draw(): void {
		var canvas: any = document.getElementById("blackjack-table");
		var context: any = canvas.getContext("2d");
		context.drawImage(this.image, this.pos_x, this.pos_y, this.image.width, this.image.height);
	}
}
