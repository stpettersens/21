/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <string>
#include <vector>
//#include "cards.h"
using namespace std;

class Dealer {
private:
	vector<string> cards;
	vector<int> values;
	int calcTotal();
	string hit();
	void stand();
public:
	Cards shuffle(Cards cards);
	vector<string> deal(Cards cards);
	bool hasBlackjack();
	bool isBust();
	vector<string> respond(vector<string> cards);
	int showCards();
	string revealFirstCard();
};

