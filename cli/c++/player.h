/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <string>
#include <vector>
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

