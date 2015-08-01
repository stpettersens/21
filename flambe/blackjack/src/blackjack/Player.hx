/*
    Blackjack
    Copyright 2015 Sam Saint-Pettersen
    Released under the MIT/X11 License.
    
    Flambe/Haxe implementation
*/
package blackjack;

import flambe.Entity;
import flambe.System;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.display.FillSprite;
import flambe.display.ImageSprite;

class Player
{
	var debug: Bool;
	var cards: Array<String>;
	var values: Array<Int>;
	var pack: AssetPack;

	public function new(debug: Bool, pack: AssetPack)
	{
		this.debug = debug;
		this.cards = new Array<String>();
		this.values = new Array<Int>();
		this.pack = pack;
	}

	public function calcTotal(): Int
	{
		this.values.sort(function(a: Int, b: Int) { return b - a; });
		var total: Int = 0;
		for(i in 0 ... this.values.length)
		{
			var v: Int = this.values[i];
			if(v == 1)
			{
				if((total + 11) <= 21) v = 11;
				if((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	public function hasBlackjack(): Bool
	{
		var blackjack: Bool = false;
		if(this.calcTotal() == 21)
		{
			Debug.emit(this.debug, "Player has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	public function isBust(): Bool
	{
		var bust: Bool = false;
		if(this.calcTotal() > 21)
		{
			Debug.emit(this.debug, "Player is bust!");
			bust = true;
		}
		return bust;
	}

	public function receiveCards(player_cards: Array<String>): Array<String>
	{
		var pc: String = "";
		for(i in 0 ... player_cards.length)
		{
			var cv: Array<String> = player_cards[i].split(":");
			this.cards.push(cv[0]);
			this.values.push(Std.parseInt(cv[1]));
		}
		pc = this.cards[0] + this.cards[1];
		Debug.emit(this.debug, "\nPlayer receives their cards:");
		Debug.emit(this.debug, "$pc --> $this.calcTotal()");

		return [ this.cards[0], this.cards[1] ];
	}

	public function hit(cards: Cards): String
	{
		var card: String = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		Debug.emit(this.debug, "Player hits.");
		Debug.emit(this.debug, "Player gets $card");
		Debug.emit(this.debug, "Player has $this.calcTotal()");
		return card;
	}

	public function stand(): Void
	{
		Debug.emit(this.debug, "Player stands.");
		Debug.emit(this.debug, "Player has $this.calcTotal()");
	}

	public function showCards(): Int
	{
		var cards: String = "";
		for(i in 0 ... this.cards.length)
		{
			cards += this.cards[i];
		}
		Debug.emit(this.debug, "\nPlayer has:");
		Debug.emit(this.debug, "$cards --> $this.calcTotal()");
		return this.calcTotal();
	}
}
