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

class Dealer
{
	var debug: Bool;
	var index: Int;
	var pos: Int;
	var cards: Array<String>;
	var values: Array<Int>;
	var pack: AssetPack;

	public function new(debug: Bool, pack: AssetPack)
	{
		this.debug = debug;
		this.index = 0;
		this.pos = 225;
		this.cards = new Array<String>();
		this.values = new Array<Int>();
		this.pack = pack;
	}

	public function calcTotal(): Int
	{
		this.values.sort(function(a: Int, b: Int) { return b - a; });
		var total: Int = 0;
		for(i in 0 ... values.length) 
		{
			var v: Int = this.values[i];
			if(v == 1)
			{
				if((total + 11) <= 21) v = 11;
				else if((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	function hit(cards: Cards): Card
	{
		this.index++;
		this.pos += 90;
		var card: String = cards.draw();
		this.cards.push(card);
		this.values.push(cards.getValue());
		Debug.emit(this.debug, "Dealer hits.");
		Debug.emit(this.debug, "Dealer gets $card");
		return new Card(card, this.pos, 10, this.pack);
	}

	function stand(): Void
	{
		Debug.emit(this.debug, "Dealer stands.");
	}

	public function shuffle(cards: Cards): Void
	{
		if(cards.getPlayed() == 0 || cards.getPlayed() >= 45)
		{
			Debug.emit(this.debug, "-------------------------------------------------------");
			Debug.emit(this.debug, "Dealer is shuffling cards...");
			Debug.emit(this.debug, "-------------------------------------------------------");
			cards.shuffle();
		}
	}

	public function deal(cards: Cards): Array<String>
	{
		var dealt = new Array<String>();
		var i: Int = 1;
		Debug.emit(this.debug, "-------------------------------------------------------");
		Debug.emit(this.debug, "Dealer is dealing cards for a new game...");
		Debug.emit(this.debug, "-------------------------------------------------------");
		while(i <= (2 * 2))
		{
			dealt.push(cards.draw() + ":" + cards.getValue());
			i++;
		}
		i = 0;
		while(i < 2)
		{
			var cv: Array<String> = dealt[i].split(":");
			this.cards.push(cv[0]);
			this.values.push(Std.parseInt(cv[1]));
			i++;
		}
		Debug.emit(this.debug, "\nDealer has:");
		Debug.emit(this.debug, "[**]$this.cards[1]");
		return [ dealt[2], dealt[3] ];
	}

	public function hasBlackjack(): Bool
	{
		var blackjack: Bool = false;
		if(this.calcTotal() == 21)
		{
			Debug.emit(this.debug, "Dealer has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	public function isBust(): Bool
	{
		var bust: Bool = false;
		if(this.calcTotal() > 21)
		{
			Debug.emit(this.debug, "Dealer is bust!");
			bust = true;
		}
		return bust;
	}

	public function respond(cards: Cards): Array<Card>
	{
		this.showCards();
		var responding: Bool = true;
		var response_cards = new Array<Card>();
		while(responding)
		{
			var total: Int = 0;
			while(total <= 18)
			{
				total = this.calcTotal();
				if(total == 16)
				{
					if(Math.floor(Std.random(6)) >= 3)
						response_cards.push(this.hit(cards)); // Take risk.
					else
						this.stand(); // Play it safe.
				}
				else if(total >= 17)
				{
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

	public function showCards(): Int
	{
		this.index = 0;
		this.pos = 225;
		var cards: String = "";
		for(i in 0 ... this.cards.length)
		{
			cards += this.cards[i];
		}
		Debug.emit(this.debug, "\nDealer has:");
		Debug.emit(this.debug, "$cards --> $this.calcTotal()");
		return this.calcTotal();
	}

	public function receiveCards(): Array<Card>
	{
		var cardA = new Card("c", this.pos, 10, this.pack);
		this.pos += 90;
		var cardB = new Card(this.cards[1], this.pos, 10, this.pack);
		this.index += 2;
		return [ cardA, cardB ];
	}

	public function revealFirstCard(): Card
	{
		return new Card(this.cards[0], 225, 10, this.pack);
	}
}
