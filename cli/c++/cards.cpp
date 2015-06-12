/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <iostream>
#include <string>
#include <cstring>
#include <cstdlib>
#include <ctime>
#include <algorithm>
#include <vector>
using namespace std;

class Cards {
private:
	int index;
	int deck_num;
	vector<string> deck;
	vector<string> played;
	string suits[4];
	string ranks[13];
	string getRank();
	string getSuit();
	string getCard();
public:
	Cards();
	void shuffle();
	void setIndex(int idx);
	string draw();
	int getValue();
	int getPlayed();
	string drawAll();
};

Cards::Cards() {
	srand(time(0));

	deck_num = 52;

	suits[0] = "h";
	suits[1] = "d";
	suits[2] = "c";
	suits[3] = "s";

	ranks[0] = "A";
	ranks[1] = "2";
	ranks[2] = "3";
	ranks[3] = "4";
	ranks[4] = "5";
	ranks[5] = "6";
	ranks[6] = "7";
	ranks[7] = "8";
	ranks[8] = "9";
	ranks[9] = "10";
	ranks[10]= "J";
	ranks[11]= "Q";
	ranks[12]= "K";
}

string Cards::getRank() {
	return ranks[rand() % 13];
}

string Cards::getSuit() {
	return suits[rand() % 4];
}

string Cards::getCard() {
	return getRank() + getSuit();
}

void Cards::shuffle() {
	index = -1;
	while(true) {
		string card = getCard();
		if(std::find(deck.begin(), deck.end(), card) != deck.end()) {}
		else deck.push_back(card);
		if(deck.size() == deck_num) break;
	}
}

void Cards::setIndex(int idx) {
	index = idx;
}

string Cards::draw() {
	if(played.size() == deck_num || index == -1) index = 0;
	played.push_back(deck[index]);
	cout << "idx is " << index << endl;
	return "[" + deck[index] + "]";
}

int Cards::getValue() {
	string strval = deck[index];
	int value = 0;
	if(strval[0] == 'A') {
		value = 1;
	}
	else if(strval[0] == 'J' || strval[0] == 'Q' || strval[0] == 'K') {
		value = 10;
	}
	else {
		value = atoi(strval.c_str());
	}
	index++;
	cout << "Index is now: " << index << endl;
	return value;
}

int Cards::getPlayed() {
	return played.size();
}

string Cards::drawAll() {
	string draws = "";
	for(int i = 0; i < deck_num; i++) {
		draws += draw();
		index++;
	}
	return draws;
}
