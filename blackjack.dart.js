/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/Dart implementation
*/

import 'dart:html';
import 'cards.dart';
import 'card.dart';
import 'player.dart';
import 'dealer.dart';
import 'screentip.dart';
import 'score.dart';
import 'debug.dart';

bool debug = true;
bool use_ai = false;
bool playing = true;
int player_index = 2;
List<Card> player_cards = [];
int dealer_index = 2;
List<Card> dealer_cards = [];
Screentip screentip = null;
Score instruction = null;
Score p_score = null;
Score d_score = null;
Card dealer_pile = null;
Cards cards = null;
Player player = null;
Dealer dealer = null;
num timer = 0;
var canvas = null;

num SCREEN_WIDTH = 780;
num SCREEN_HEIGHT = 500;

void main() {
	Debug.emit(debug, "Initialized HTML5 Blackjack (Dart build).");
	canvas = document.getElementById("blackjack-table");
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	canvas.style.backgroundColor = "rgb(0, 153, 0)";
	canvas.style.marginLeft = "auto";
	canvas.style.marginRight = "auto";
	canvas.style.display = "block";
	canvas.style.border = "1px dotted rgb(0, 0, 0)";

	screentip = new Screentip(debug, ((SCREEN_WIDTH / 2) - 50), 190);
	instruction = new Score(debug, ((SCREEN_WIDTH / 2) - 155), 450);
	p_score = new Score(debug, 153, 315);
	d_score = new Score(debug, 153, 25);
	cards = new Cards();
	newGame();

	// Touch controls.
	DateTime start = null;
	document.addEventListener("touchstart", 
		(event) => start = eventTouchStart(event), 
	false);

	document.addEventListener("touchend",
		(event) => eventTouchEnd(event, start),
	false);

	// Mouse controls.
	document.addEventListener("mousedown",
		(event) => eventMouseDown(event),
	false);

	// Prevent context menu show up on right click.
	document.addEventListener("contextmenu",
		(event) => event.preventDefault(),
	false);

	// Keyboard controls.
	document.addEventListener("keydown",
		(event) => eventKeyDown(event),
	false);
}

DateTime eventTouchStart(dynamic event) {
	event.preventDefault();
	return new DateTime.now();
}

void eventTouchEnd(dynamic event, DateTime start) {
	event.preventDefault();
	DateTime now = new DateTime.now();
	Duration elapsed = now.difference(start);
	Debug.emit(debug, elapsed.inSeconds);
	if(elapsed.inSeconds >= 1) {
		if(playing) stand();
		else newGame();
	}
	else {
		if(playing) hit();
		
	}
}

void eventMouseDown(dynamic event) {
	if(playing && event.which == 1) { // Left click for hit.
		hit();
	}
	else if(playing && event.which == 3) { // Right click for stand.
		stand();
	}
	else if(!playing && event.which == 1) { // Left click for yes, another game.
		newGame();
	}
}

void eventKeyDown(dynamic event) {
	if(playing && event.keyCode == 72) { // H for hit.
		hit();
	}
	else if(playing && event.keyCode == 83) { // S for stand.
		stand();
	}
	else if(!playing && event.keyCode == 89) { // Y for yes, another game.
		newGame();
	}
	else if(!playing && event.keyCode == 78) { // N for no and exit.
		exitToGitHub();
	}
	else if(event.keyCode == 27) { // Escape key always exits.
		exitToGitHub();
	}
}

bool isTouchScreenDevice() {
	bool isTouch = false;
	String ua = window.navigator.userAgent;
	if(ua.indexOf("Mobile") != -1 || ua.indexOf("Tablet") != -1) {
		isTouch = true;
	}
	return isTouch;
}

void showCards() {
	playing = false;
	dealer_cards[0] = dealer.revealFirstCard();
	int ds = dealer.showCards();
	int ps = player.showCards();
		
	if(ps == 21 && player_index == 2 && ds == 21) {
		screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
	}
	else if(ds == 21 && dealer_index == 2 && ps == 21) {
		screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
	}
	else if((ps == ds) || (ps > 21 && ds > 21)) {
		screentip.emit("PUSH", "Neither dealer nor player won.");
	}
	else if(ps <= 21 && ps > ds) {
		screentip.emit("PLAYER WINS", "Player wins with " + ps.toString() + ". Well done.");
	}
	else if(ds <= 21 && ds > ps) {
		screentip.emit("DEALER WINS", "Dealer wins with " + ds.toString() + ". Too bad.");
	}
	else if(ps > 21 && ds <= 21) {
		screentip.emit("DEALER WINS", "Dealer wins. Player bust.");
	}
	else if(ds > 21 && ps <= 21) {
		screentip.emit("PLAYER WINS", "Player wins. Dealer bust.");
	}

	if(cards.getPlayed() == 52) {
		dealer_pile = new Card(Card.getImage("d"), 10, 10);
	}
	Debug.emit(debug, "Cards played  ${cards.getPlayed()}");
	d_score.emit(dealer.calcTotal());
	if(!isTouchScreenDevice()) {
		instruction.emit("Play again? Yes [Y key or LMB] or No [N key or Escape key].");
	}
	else {
		instruction.emit("Play again? Long tap screen to continue.");
	}
	draw();
}

void newGame() {
	clear();
	playing = true;
	player_index = 2;
	player_cards = new List<Card>();
	dealer_index = 2;
	dealer_cards = new List<Card>();
	dealer_pile = new Card(Card.getImageData("c"), 10, 10);
	screentip.clear();
	player = new Player(debug);
	dealer = new Dealer(debug);
	dealer.shuffle(cards);
	player_cards = player.receiveCards(dealer.deal(cards));
	dealer_cards = dealer.receiveCards();
	player_cards.add(new Card(Card.getImageData("d"), 405, 310));
	player_cards.add(new Card(Card.getImageData("d"), 495, 310));
	player_cards.add(new Card(Card.getImageData("d"), 585, 310));
	dealer_cards.add(new Card(Card.getImageData("d"), 405, 10));
	dealer_cards.add(new Card(Card.getImageData("d"), 495, 10));
	dealer_cards.add(new Card(Card.getImageData("d"), 585, 10));
	update();
	draw();
}

void update() {
	if(hasBlackjack() || isBust()) {
		showCards();
	}
	p_score.emit(player.calcTotal());

	if(playing) {
		d_score.emit("?");
		if(!isTouchScreenDevice()) {
			instruction.emit("Hit [H key or LMB] or Stand [S key or RMB]?");
		}
		else {
			instruction.emit("Hit [Short tap] or Stand [Long tap]?");
		}
	}
}

void draw() {
	clear();
	screentip.draw();
	instruction.draw();
	p_score.draw();
	d_score.draw();
	dealer_pile.draw();
	for(int i = 0; i < player_cards.length; i++) {
		player_cards[i].draw();
	}
	for(int i = 0; i < dealer_cards.length; i++) {
		dealer_cards[i].draw();
	}
}

bool hasBlackjack() {
	bool blackjack = false;
	if(player.hasBlackjack() || dealer.hasBlackjack()) {
		blackjack = true;
	}
	return blackjack;
}

bool isBust() {
	bool bust = false;
	if(player.isBust() || dealer.isBust()) {
		bust = true;
	}
	return bust;
}

void hit() {
	if(player_index < 6) {
		player_cards[player_index] = player.hit(cards);
		player_index++;
		update();
	}
	draw();
}

void stand() {
	player.stand();
	List<Card> received = dealer.respond(cards);
	for(int i = 0; i < received.length; i++) {
		List<int> xy = dealer_cards[dealer_index].getXY();
		dealer_cards[dealer_index] = received[i];
		dealer_cards[dealer_index].setXY(xy[0], xy[1]);
		Debug.emit(debug, "Added image at ${xy[0]},${xy[1]}");
		Debug.emit(debug, dealer_index);
		dealer_index++;
	}
	showCards();
}

void clear() {
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}

void exitToGitHub() {
	window.location.href = "https://github.com/stpettersens/21";
}
