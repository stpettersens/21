/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/TypeScript implementation
*/

/// <reference path="debug.ts"/>

var debug: boolean = false;

class Screentip {
	private x: number;
	private y: number;
	private title: string;
	private msg: string;

	constructor(debug: boolean, x: number, y: number) {
		debug = debug;
		this.x = x;
		this.y = y;
		this.title = "";
		this.msg = "";
		Debug.print(debug, "Created screentip at " + this.x + "," + this.y); // !
	}

	public emit(title: string, message: string): void {
		this.clear();
		this.title = title;
		this.msg = message;
	}

	public clear(): void {
		this.title = "";
		this.msg = "";
	}

	public draw(): void {
		if(this.msg == null) this.msg = "";
		if(this.title == null) this.title = "";
		var canvas: any = document.getElementById("blackjack-table");
		var context: any = canvas.getContext("2d");
		context.font = "10pt Verdana";
		context.fillStyle = "white";
		context.fillText(this.title, this.x, this.y);
		context.fillText(this.msg, (this.x - 45), (this.y + 20));
	}
}
