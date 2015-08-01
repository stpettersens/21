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

class Cards 
{
	var index: Int;
	var deck_num: Int;
	var deck: Array<String>;
	var played: Array<String>;
	var ranks: Array<String>;
	var suits: Array<String>;

	public function new()
	{
		this.index = -1;
		this.deck_num = 52;
		this.deck = new Array<String>();
		this.played = new Array<String>();
		this.ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
		this.suits = [ "h", "d", "c", "s" ];
	}

	function getRank(): String
	{
		var i: Int = Math.floor(Std.random(this.ranks.length));
		return this.ranks[i];
	}

	function getSuit(): String
	{
		var i: Int = Math.floor(Std.random(this.suits.length));
		return this.suits[i];
	}

	function getCard(): String
	{
		return "$this.getRank() $this.getSuit()";
	}

	public function shuffle(): Void
	{
		this.index = -1;
		this.deck = new Array<String>();
		this.played = new Array<String>();
		while(true)
		{
			var card: String = this.getCard();
			//if(this.deck.indexOf(card) != -1)
			//{
			this.deck.push(card);
			if(this.deck.length == 5) //this.deck_num)
				break;
			//}
		}
	}

	public function draw(): String
	{
		if(this.played.length == this.deck_num || this.index == -1)
			this.index = 0;

		this.played.push(this.deck[this.index]);
		var rs: Array<String> = this.deck[this.index].split(" ");
		return "[$rs[0]$rs[1]]";
	}

	public function getValue(): Int
	{
		var rs: Array<String> = this.deck[this.index].split(" ");
		this.index++;
		var val: Int = 0;
		if(rs[0] == "A") val = 1;
		else if(rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") val = 10;
		else val = Std.parseInt(rs[0]);
		return val;
	}

	public function getPlayed(): Int
	{
		return this.played.length;
	}

	public function drawAll(): Array<String>
	{
		this.index = 0;
		var draws = new Array<String>();
		for(i in 0 ... this.deck_num)
		{
			draws.push(this.draw());
			this.index++;
		}
		this.index = -1;
		return draws;
	}
}
