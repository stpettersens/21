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

	Cards() {
		this.index = -1;
		this.deck_num = 52;
		this.deck = new List<String>();
		this.played = new List<int>();
		this.ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
		this.suits = [ "h", "d", "c", "s" ];
	}

	String _getRank() {
		Random rand = new Random();
		int i = rand.nextInt(this.ranks.length);
		return this.ranks[i];
	}

	String _getSuit() {
		Random rand = new Random();
		int i = rand.nextInt(this.suits.length);
		return this.suits[i];
	}

	String _getCard() {
		return "${this._getRank()} ${this._getSuit()}";
	}

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

	String draw() {
		if(this.played.length == this.deck_num || this.index == -1) {
			this.index = 0;
		}
		this.played.add(this.deck[this.index]);
		List<String> rs = this.deck[this.index].split(" ");
	}
}
