/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <string>
#include <vector>
#include <cstdio>
#include "cards.h"
using namespace std;

class Dealer {
private:
	vector<string> cards;
	vector<int> values;
	int calcTotal();
	string hit(Cards cards);
	void stand();
public:
	Cards shuffle(Cards cards);
	vector<string> deal(Cards cards);
	bool hasBlackjack();
	bool isBust();
	vector<string> respond(Cards cards);
	int showCards();
	string revealFirstCard();
};

int Dealer::calcTotal() {
	int total = 0;
	for(int i = 0; i < values.size(); i++) {
		int v = values[i];
		if(v == 1) {
			if((total + 11) <= 21) v = 11;
			if((total + 11) > 21) v = 1;
		}
		total += v;
	}
	return total;
}

string Dealer::hit(Cards cards) {
	string card = cards.draw();
	this->cards.push_back(card);
	this->values.push_back(cards.getValue());
	cout << "Dealer hits." << endl;
	cout << "Dealer gets " << card << endl;
	return card;
}

void Dealer::stand() {
	cout << "Dealer stands." << endl;
}

Cards Dealer::shuffle(Cards cards) {
	if(cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
		cout << "----------------------------------------------------------" << endl;
		cout << "Dealer is shuffling cards..." << endl;
		cout << "----------------------------------------------------------" << endl;
		cards.shuffle();
		return cards;
	}
}
vector<string> Dealer::deal(Cards cards) {
	cout << "----------------------------------------------------------" << endl;
	cout << "Dealer is dealing cards for a new game..." << endl;
	cout << "----------------------------------------------------------" << endl;
	vector<string> dealt;
	vector<string> player_cards;
	for(int i = 0; i < (2 * 2); i++) {
		string card = cards.draw();
		int value = cards.getValue();
		dealt.push_back(card + ":" + to_string(value));
		if(i < 2) {
			this->cards.push_back(card);
			this->values.push_back(value);
		}
	}
	for(int i = 2; i < (2 * 2); i++) {
		player_cards.push_back(dealt[i]);
	}
	cout << "\nDealer has:" << endl;
	cout << "[**]" << this->cards[1] << endl;
	return player_cards;
}

bool Dealer::hasBlackjack() {
	bool blackjack = false;
	if(calcTotal() == 21) {
		cout << "Dealer has Blackjack!" << endl;
		blackjack = true;
	}
	return blackjack;
}

bool Dealer::isBust() {
	bool bust = false;
	if(calcTotal() > 21) {
		cout << "Dealer is bust!" << endl;
		bust = true;
	}
	return bust;
}

vector<string> Dealer::respond(Cards cards) {
	showCards();
	vector<string> response_cards;
	bool responding = true;
	while(responding) {
		int total = 0;
		while(total <= 18) {
			total = calcTotal();
			if(total == 16) {
				if((rand() % 6) >= 3) {
					response_cards.push_back(hit(cards)); // Take risk.
				}
				else {
					stand(); // Play it safe.
				}
			}
			else if(total >= 17) {
				stand();
				responding = false;
				break;
			}
			else {
				response_cards.push_back(hit(cards));
			}
		}
	}
	return response_cards;
}

int Dealer::showCards() {
	string cards = "";
	for(int i = 0; i < this->cards.size(); i++) {
		cards += this->cards[i];
	}
	cout << "\nDealer has:" << endl;
	cout << cards << " --> " << calcTotal() << endl;
	return calcTotal();
}

string Dealer::revealFirstCard() {
	return this->cards[0];
}

