/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <iostream>
#include <string>
#include <cstdlib>
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
