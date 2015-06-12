/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="debug.ts"/>

var debug: boolean = false;

class Score {
	private x: number;
	private y: number;
	private score: string;

	constructor(debug: boolean, x: number, y: number) {
		debug = debug;
		this.x = x;
		this.y = y;
		this.score = "";
		Debug.print(debug, "Created score counter at " + this.x + "," + this.y); // !
	}

	public emit(score: any): void {
		this.clear();
		this.score = score;
	}

	public clear(): void {
		this.score = "";
	}

	public draw(): void {
		var canvas: any = document.getElementById("blackjack-table");
		var context: any = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.score, this.x, this.y);
	}
}
