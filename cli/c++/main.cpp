/*
Blackjack 

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.
*/

#include <iostream>
#include <string>
#include <vector>
#include "cards.h"
#include "dealer.h"
#include "player.h"
using namespace std;

bool playing = true;
Cards cards;
Dealer dealer;
Player player;
vector<string> player_cards;
vector<string> dealer_cards;
int player_index = 0;
int dealer_index = 0;

void newGame() {
	cards = dealer.shuffle(cards);
	player_cards = player.receiveCards(dealer.deal(cards));
	cards.setIndex(5);
}

void hit() {
	if(player_index < 6) {
		player_cards[player_index] = player.hit(cards);
		player_index++;
	}
}

void stand() {

}

int main() {
	newGame();
	while(playing) {
		char action;
		cout << "Hit [H] or Stand [S]?" << endl;
		cin >> action;
		if(action == 'h') hit();
		else if(action == 's') stand();
	}
	return 0;
}
3
