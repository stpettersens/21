/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'cards.dart';
import 'card.dart';
import 'debug.dart';

class Player {
	bool debug;
	int index;
	int pos;
	List<String> cards;
	List<int> values;

	/// Player implements the player for Blackjack.
	/// [bool] debug Enable debug messages?
	Player(bool debug) {
		this.debug = debug;
		this.index = -1;
		this.pos = 225;
		this.cards = new List<String>();
		this.values = new List<int>();
	}

	/// Calculates the total value of player's held cards.
	/// Returns [int] Total value for player's cards.
	int calcTotal() {
		this.values.sort((b, a) => a.compareTo(b));
		int total = 0;
		for(int i = 0; i < this.values.length; i++) {
			int v = this.values[i];
			if(v == 1) {
				if((total + 11) <= 21) v = 11;
				if((total + 11) > 21) v = 1;
			}
			total += v;
		}
		return total;
	}

	/// Determine if player has Blackjack.
	/// Returns [bool] Does player have Blackjack?
	bool hasBlackjack() {
		bool blackjack = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, "Player has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	/// Determine if player is bust.
	/// Returns [bool] Is player bust?
	bool isBust() {
		bool bust = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, "Player is bust!");
			bust = true;
		}
		return bust;
	}

	/// Receive cards from dealer.
	/// [List<String>] player_cards Player's cards as List<String>.
	/// Returns [List<Card>] Player's cards as List<Card>.
	List<Card> receiveCards(List<String> player_cards) {
		String pc = "";
		for(int i = 0; i < player_cards.length; i++) {
			List<String> cv = player_cards[i].split(":");
			this.cards.add(cv[0]);
			this.values.add(int.parse(cv[1]));
		}
		pc = this.cards[0] + this.cards[1];
		Debug.emit(this.debug, "\nPlayer receives their cards:");
		Debug.emit(this.debug, "${pc} --> ${this.calcTotal()}");

		this.index++;
		Card cardA = new Card(Card.getImageData(this.cards[this.index]), this.pos, 310);
		this.pos += 90;
		this.index++;
		Card cardB = new Card(Card.getImageData(this.cards[this.index]), this.pos, 310);
		return [cardA, cardB];
	}

	/// Player hits.
	/// [Cards] cards Game cards.
	/// Returns [Card] Player's drawn card.
	Card hit(Cards cards) {
		String card = cards.draw();
		this.cards.add(card);
		this.values.add(cards.getValue());
		this.index++;
		this.pos += 90;
		Debug.emit(this.debug, "Player hits.");
		Debug.emit(this.debug, "Player gets ${card}");
		Debug.emit(this.debug, "Player has ${this.calcTotal()}");
		return new Card(Card.getImageData(new RegExp("([A-Za-z0-9]+)").stringMatch(card)), this.pos, 310);
	}

	/// Player stands.
	void stand() {
		Debug.emit(this.debug, "Player stands.");
		Debug.emit(this.debug, "Player has ${this.calcTotal()}");
	}

	/// Show player's cards.
	/// Returns [int] Total value of player's cards.
	int showCards() {
		this.index = 0;
		this.pos = 225;
		String cards = "";
		for(int i = 0; i < this.cards.length; i++) {
			cards += "${cards}${this.cards[i]}";
		}
		Debug.emit(this.debug, "\nPlayer has:");
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}
}
