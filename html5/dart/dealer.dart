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

class Dealer {
	bool debug;
	int index;
	int pos;
	List<String> cards;
	List<int> values;

	/// Dealer implements the dealer for Blackjack.
	/// [bool] debug Enable debug messages?
	Dealer(bool debug) {
		this.debug = debug;
		this.index = 0;
		this.pos = 225;
		this.cards = new List<String>();
		this.values = new List<int>();
	}

	/// Calculate the total value of dealer's held cards.
	/// Returns [int] Total value of dealer's cards.
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

	/// Dealer hits.
	/// [Cards] cards Game cards.
	/// Returns [Card] Dealer's drawn card.
	Card hit(Cards cards) {
		this.index++;
		this.pos += 90;
		String card = cards.draw();
		this.cards.add(card);
		this.values.add(cards.getValue());
		Debug.emit(this.debug, "Dealer hits.");
		Debug.emit(this.debug, "Dealer gets ${card}");
		return new Card(Card.getImageData(new RegExp("([A-Za-z0-9]+)").stringMatch(card)), this.pos, 10);
	}

	/// Dealer stands.
	void stand() {
		Debug.emit(this.debug, "Dealer stands.");
	}

	/// Dealer shuffles
	/// [Cards] cards Game cards to shuffle.
	void shuffle(Cards cards) {
		if(cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
			Debug.emit(this.debug, "----------------------------------------------------");
			Debug.emit(this.debug, "Dealer is shuffling cards...");
			Debug.emit(this.debug, "----------------------------------------------------");
			cards.shuffle();
		}	
	}

	/// Dealer deals.
	/// [Cards] cards Game cards.
	/// Returns [List<String>] Player's cards.
	List<String> deal(Cards cards) {
		List<String> dealt = new List<String>();
		Debug.emit(this.debug, "----------------------------------------------------");
		Debug.emit(this.debug, "Dealer is dealing cards for a new game...");
		Debug.emit(this.debug, "----------------------------------------------------");
		for(int i = 1; i <= (2 * 2); i++) {
			dealt.add("${cards.draw()}:${cards.getValue()}");
		}
		for(int i = 0; i < 2; i++) {
			List<String> cv = dealt[i].split(":");
			this.cards.add(cv[0]);
			this.values.add(int.parse(cv[1]));
		}
		Debug.emit(this.debug, "\nDealer has:");
		Debug.emit(this.debug, "[**]${this.cards[1]}");
		return [dealt[2], dealt[3]];
	}

	/// Determine if dealer has Blackjack.
	/// Returns [bool] Does dealer have Blackjack?
	bool hasBlackjack() {
		bool blackjack = false;
		if(this.calcTotal() == 21) {
			Debug.emit(this.debug, "Dealer has Blackjack!");
			blackjack = true;
		}
		return blackjack;
	}

	/// Determine if dealer is bust.
	/// Returns [bool] Is dealer bust?
	bool isBust() {
		bool bust = false;
		if(this.calcTotal() > 21) {
			Debug.emit(this.debug, "Dealer is bust!");
		}
	}

	/// Dealer responds to player action (e.g. a hit or stand).
	/// [Cards] cards Game cards.
	/// Returns [List<Card>] Cards returned.
	List<Card> respond(Cards cards) {
		this.showCards();
		bool responding = true;
		List<Card> response_cards = new List<Card>();
		while(responding) {
			int total = 0;
			while(total <= 18) {
				total = this.calcTotal();
				if(total == 16) {
					Random rand = new Random();
					if(rand.nextInt(6) >= 3) {
						response_cards.add(this.hit(cards)); // Take risk.
					}
					else {
						this.stand(); // Play it safe.
					}
				}
				else if(total >= 17) {
					this.stand();
					responding = false;
					break;
				}
				else {
					response_cards.add(this.hit(cards));
				}
			}
		}
		return response_cards;
	}

	/// Show dealer's cards.
	/// Returns [int] Total value of dealer's cards.
	int showCards() {
		this.index = 0;
		this.pos = 225;
		String cards = "";
		for(int i = 0; i < this.cards.length; i++) {
			cards += this.cards[i];
		}
		Debug.emit(this.debug, "\nDealer has:");
		Debug.emit(this.debug, "${cards} --> ${this.calcTotal()}");
		return this.calcTotal();
	}

	/// Dealer receives cards.
	/// Returns [List<Card>] Dealer's received cards.
	List<Card> receiveCards() {
		Card cardA = new Card(Card.getImageData("c"), this.pos, 10);
		this.pos += 90;
		Card cardB = new Card(Card.getImageData(this.cards[1]), this.pos, 10);
		this.index += 2;
		return [cardA, cardB];
	}

	/// Dealer reveals first card.
	/// Returns [Card] Revealed first card.
	Card revealFirstCard() {
		return new Card(Card.getImageData(this.cards[0]), 225, 10);
	}
}
