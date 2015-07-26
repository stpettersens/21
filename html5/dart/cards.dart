/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:math';

class Cards {
	int index;
	int deck_num;
	List<String> deck;
	List<String> played;
	List<String> ranks;
	List<String> suits;

	/// Card implements a collection of playing Cards
	/// and methods to draw and shuffle.
	Cards() {
		this.index = -1;
		this.deck_num = 52;
		this.deck = new List<String>();
		this.played = new List<String>();
		this.ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
		this.suits = [ "h", "d", "c", "s" ];
	}

	/// Get a rank for a card.
	/// Returns [String] Card rank.
	String _getRank() {
		Random rand = new Random();
		int i = rand.nextInt(this.ranks.length);
		return this.ranks[i];
	}

	/// Get a suit for a card.
	/// Returns [String] Card suit.
	String _getSuit() {
		Random rand = new Random();
		int i = rand.nextInt(this.suits.length);
		return this.suits[i];
	}

	/// Get a card.
	/// Returns [String] Card as string.
	String _getCard() {
		return "${this._getRank()} ${this._getSuit()}";
	}

	/// Shuffle cards.
	void shuffle() {
		this.index = -1;
		this.deck = new List<String>();
		this.played = new List<String>();
		while(true) {
			String card = this._getCard();
			if(this.deck.indexOf(card) == -1) {
				this.deck.add(card);
				if(this.deck.length == this.deck_num) {
					break;
				}
			}
		}
	}

	/// Draw a card.
	/// Returns [String] Drawn card as string.
	String draw() {
		if(this.played.length == this.deck_num || this.index == -1) {
			this.index = 0;
		}
		this.played.add(this.deck[this.index]);
		List<String> rs = this.deck[this.index].split(" ");
		return "[${rs[0]}${rs[1]}]";
	}

	/// Get a card's value.
	/// Returns [int] Card's value.
	int getValue() {
		List<String> rs = this.deck[this.index].split(" ");
		this.index++;
		int value = 0;
		if(rs[0] == "A") value = 1;
		else if(rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") value = 10;
		else value = int.parse(rs[0]);
		return value;
	}

	/// Get number of played cards.
	/// Returns [int] Number of cards played.
	int getPlayed() {
		return this.played.length;
	}

	/// Draw all cards from the deck.
	/// Returns [List<String>] All cards from deck.
	List<String> drawAll() {
		this.index = 0;
		List<String> draws = new List<String>();
		for(int i = 0; i < this.deck_num; i++) {
			string d = this.draw();
			draws.add(d);
			this.index++;
		}
		this.index = -1;
		return draws;
	}
}
