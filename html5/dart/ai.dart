/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:math';
import 'cards.dart';
import 'card.dart';
import 'debug.dart';

class AI {
	bool debug;
	int index;
	int pos;
	List<String> cards;
	List<int> values;

	/// AI implements an artificial player (not the dealer).
	/// [bool] debug Enable debug messages?
	AI(bool debug) {
		this.debug = debug;
		this.index = 0;
		this.pos = 255;
		this.cards = new List<String>();
		this.values = new List<int>();
	}

	/// Calculate the total value of AI's held cards.
	/// Returns [int] Total value of AI's cards.
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

	/// Determine if AI has Blackjack.
	/// Returns [bool] Does player have Blackjack?
	bool hasBlackjack() {
		bool blackjack = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, "AI has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	/// Determine if AI is bust.
	/// Returns [bool] Is AI bust?
	bool isBust() {
		bool bust = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, "AI is bust!");
			bust = true;
		}
		return bust;
	}

	/// Receive cards from dealer.
	/// [List<String>] ai_cards AI's cards as List<String>.
	/// Returns [List<Card>] AI's cards as List<Card>.
	List<Card> receiveCards(List<String> ai_cards) {
		String ac = "";
		for(int i = 0; i < ai_cards.length; i++) {
			List<String> cv = ai_cards[i].split(":");
			this.cards.add(cv[0]);
			this.values.add(int.parse(cv[1]));
		}
		ac = this.cards[0] + this.cards[1];
		Debug.emit(this.debug, "\nPlayer receives their cards:");
		Debug.emit(this.debug, "${pc} --> ${this.calcTotal()}");

		this.index++;
		Card cardA = new Card(Card.getImageData(this.cards[this.index]), this.pos, 310);
		this.pos += 90;
		this.index++;
		Card cardB = new Card(Card.getImageData(this.cards[this.index]), this.pos, 310);
		return [cardA, cardB];
	}

	/// AI hits.
	/// [Cards] cards Game cards.
	/// Returns [Card] AI's drawn card.
	Card _hit(Cards cards) {
		String card = cards.draw();
		this.cards.add(card);
		this.values.add(cards.getValue());
		this.index++;
		this.pos += 90;
		Debug.emit(this.debug, "AI hits.");
		Debug.emit(this.debug, "AI gets ${card}");
		Debug.emit(this.debug, "AI has ${this.calcTotal()}");
		return new Card(Card.getImageData(new RegExp("([A-za-z0-9]+)").stringMatch(card)), this.pos, 310);
	}
	
	/// AI stands.
	void _stand() {
		Debug.emit(this.debug, "AI stands.");
		Debug.emit(this.debug, "AI has ${this.calcTotal()}");
	}

	/// AI responds to cards received or dealer.
	/// [Cards] cards Game cards.
	/// Returns [List<Card>] Resonse cards.
	List<Card> respond(cards: Cards) {
		this.showCards();
		bool responding = true;
		List<Card> response_cards = new List<Card>();
		while(responding) {
			int total = 0;
			Random rand = new Random();
			while(total <= 18) {
				total = this.calcTotal();
				if(total == 16) {
					if(rand.nextInt(6) >= 3) {
						this.index++;
						this.pos += 90;
						response_cards.add(this._hit(cards)); // Take risk.
					}
					else
						this._stand(); // Play it safe.
				}
				else if(total >= 17) {
					this._stand();
					responding = false;
					break;
				}
				else {
					this.index++;
					this.pos += 90;
					response_cards.add(this._hit(cards));
				}
			}
		}
		return response_cards;
	}

	/// Show AI's cards.
	/// Returns [int] Total value of AI's cards.
	int showCards() {
		this.index = 0;
		this.pos = 225;
		String cards = "";
		for(int i = 0; i < this.cards.length; i++) {
			cards += "${cards}${this.cards[i]}";
		}
		Debug.emit(this.debug, "\nAI has:");
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}
}
