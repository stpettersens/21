/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'cards.dart';

void main() {
	Cards cards = new Cards();
	cards.shuffle();
	cards.draw();
}
