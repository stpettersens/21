/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <string>
#include <vector>
#include <cstdio>
#include "cards.h"
#include "split.h"
using namespace std;

class Player {
private:
	vector<string> cards;
	vector<int> values;
	int calcTotal();
public:
	string hit(Cards cards);
	void stand();
	bool hasBlackjack();
	bool isBust();
	vector<string> receiveCards(vector<string> player_cards);
	int showCards();
};

int Player::calcTotal() {
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

string Player::hit(Cards cards) {
	string card = cards.draw();
	this->cards.push_back(card);
	this->values.push_back(cards.getValue());
	cout << "Player hits." << endl;
	cout << "Player gets " << card << endl;
	return card;
}

void Player::stand() {
	cout << "Player stands." << endl;
}

bool Player::hasBlackjack() {
	bool blackjack = false;
	if(calcTotal() == 21) {
		blackjack = true;
	}
	return blackjack;
}

bool Player::isBust() {
	bool bust = false;
	if(calcTotal() > 21) {
		bust = true;
	}
	return bust;
}

vector<string> Player::receiveCards(vector<string> player_cards) {
	string cards = "";
	for(int i = 0; i < player_cards.size(); i++) {
		vector<string> cv = split(player_cards[i], ':');
		this->cards.push_back(cv[0]);
		this->values.push_back(atoi(cv[1].c_str()));
	}
	cards += this->cards[0] + this->cards[1];
	cout << "\nPlayer receives their cards:" << endl;
	cout << cards << " --> " << calcTotal() << endl;
	return this->cards;
}

