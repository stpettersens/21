/*
 	Blackjack
 	Copyright 2015 Sam Saint-Pettersen
 	Released under the MIT/X11 License.

 	HTML5/TypeScript implementation
*/

/// <reference path="cards.ts" />
/// <reference path="card.ts" />
/// <reference path="player.ts" />
/// <reference path="dealer.ts" />
/// <reference path="ai.ts" />
/// <reference path="screentip.ts" />
/// <reference path="score.ts" />
/// <reference path="debug.ts" />

var debug: boolean = false;
var use_ai: boolean = false;
var playing: boolean = true;
var player_index: number = 2;
var player_cards: Card[] = [];
var dealer_index: number = 2;
var dealer_cards: Card[] = [];
var screentip: Screentip = null;
var instruction: Score = null;
var p_score: Score = null;
var d_score: Score = null;
var dealer_pile: Card = null;
var cards: Cards = null;
var player: Player = null;
var dealer: Dealer = null;
var timer: number = 0;

var SCREEN_WIDTH: number = 780;
var SCREEN_HEIGHT: number = 500;

/**
 * @function Main function.
*/
window.onload = function(): void {

	Debug.emit(debug, "Initialized HTML5 Blackjack (TypeScript build).");
	var canvas: any = document.getElementById("blackjack-table");
	canvas.width = SCREEN_WIDTH.toString();
	canvas.height = SCREEN_HEIGHT.toString();
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

	/**
	 * Is the game running on a touch screen device?
	 * @returns {boolean} Is touch screen device?
	*/
	function isTouchScreenDevice(): boolean {
		var touch: boolean = false;
		var ua: string = navigator.userAgent;
		if(ua.indexOf("Mobile") !== -1 || ua.indexOf("Tablet") !== -1) {
			touch = true;
		}
		return touch;
	}

	/**
	  * Show cards at end of game.
	*/
	function showCards(): void {
		playing = false;
		dealer_cards[0] = dealer.revealFirstCard();
		var ds: number = dealer.showCards();
		var ps: number = player.showCards();
		
		if(ps === 21 && player_index === 2 && ds !== 21) {
			screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
		}
		else if(ds === 21 && dealer_index === 2 && ps !== 21) {
			screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
		}
		else if((ps == ds) || (ps > 21 && ds > 21)) {
			screentip.emit("PUSH", "Neither dealer nor player won.");
		}
		else if(ps <= 21 && ps > ds) {
			screentip.emit("PLAYER WINS", "Player wins with ${ps}. Well done.");
		}
		else if(ds <= 21 && ds > ps) {
			screentip.emit("DEALER WINS", "Dealer wins with ${ds}. Too bad.");
		}
		else if(ps > 21 && ds <= 21) {
			screentip.emit("DEALER WINS", "Dealer wins. Player bust.")
		}
		else if(ds > 21 && ps <= 21) {
			screentip.emit("PLAYER WINS", "Player wins. Dealer bust.")
		}

		if(cards.getPlayed() == 52) {
			dealer_pile = new Card(Card.getImage("d"), 10, 10);
		}
		Debug.emit(debug, "Cards played ${cards.getPlayed()}");
		d_score.emit(dealer.calcTotal());
		if(!isTouchScreenDevice()) {
			instruction.emit("Play again? Yes [Y key or LMB] or No [N key or Escape key].");
		}
		else {
			instruction.emit("Play again? Long tap screen to continue.");
		}
		draw();
	}

	/**
	 * Start a new game.
	*/
	function newGame(): void {
		clear();
		playing = true;
		player_index = 2;
		player_cards = new Array<Card>();
		dealer_index = 2;
		dealer_cards = new Array<Card>();
		dealer_pile = new Card(Card.getImageData("c"), 10, 10);
		screentip.clear();
		player = new Player(debug);
		dealer = new Dealer(debug);
		dealer.shuffle(cards);
		player_cards = player.receiveCards(dealer.deal(cards));
		dealer_cards = dealer.receiveCards();
		player_cards[2] = new Card(Card.getImageData("d"), 405, 310);
		player_cards[3] = new Card(Card.getImageData("d"), 495, 310);
		player_cards[4] = new Card(Card.getImageData("d"), 585, 310);
		dealer_cards[2] = new Card(Card.getImageData("d"), 405, 10);
		dealer_cards[3] = new Card(Card.getImageData("d"), 495, 10);
		dealer_cards[4] = new Card(Card.getImageData("d"), 585, 10);
		update();
		draw();
	}

	/**
	 * Update logic.
	*/
	function update(): void {
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

	/**
	 * Draw logic.
	*/
	function draw(): void {
		clear();
		dealer_pile.draw();
		screentip.draw();
		instruction.draw();
		p_score.draw();
		d_score.draw();
		for(var i: number = 0; i < player_cards.length; i++) {
			player_cards[i].draw();
		}
		for(var i: number = 0; i < dealer_cards.length; i++) {
			dealer_cards[i].draw();
		}
	}

	/**
	 * Determine if a Blackjack has occurred.
	 * @returns {boolean} Has a Blackjack occurred?
	*/
	function hasBlackjack(): boolean {
		var blackjack: boolean = false;
		if(player.hasBlackjack() || dealer.hasBlackjack()) {
			blackjack = true;
		}
		return blackjack;
	}

	/**
	 * Determine if a bust has occurred.
	 * @returns {boolean} Has a bust occurred?
	*/
	function isBust(): boolean {
		var bust: boolean = false;
		if(player.isBust() || dealer.isBust()) {
			bust = true;
		}
		return bust;
	}

	/**
	 * Take a hit.
	*/
	function hit(): void {
		if(player_index < 6) {
			player_cards[player_index] = player.hit(cards);
			player_index++;
			update();
		}
		draw();
	}

	/**
	 * Take a stand.
	*/
	function stand(): void {
		player.stand();
		var received: Card[] = dealer.respond(cards);
		for(var i: number = 0; i < received.length; i++) {
			var xy: number[] = dealer_cards[dealer_index].getXY();
			dealer_cards[dealer_index] = received[i];
			dealer_cards[dealer_index].setXY(xy[0], xy[1]);
			Debug.emit(debug, "Added image at ${xy[0]},${xy[1]}");
			Debug.emit(debug, dealer_index);
			dealer_index++;
		}
		showCards();
	}

	/**
	 * Clear the table.
	*/
	function clear(): void {
		var context: any = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	/**
	 * Exit to project's repository on GitHub.
	*/
	function exitToGitHub(): void {
		window.location.href = "https://github.com/stpettersens/21";
	}

	// Touch controls.
	var start: number = null;
	document.addEventListener("touchstart", function(event) {
		event.preventDefault();
		start = new Date().getTime();
	});

	document.addEventListener("touchend", function(event) {
		event.preventDefault();
		var elapsed: number = new Date().getTime() - start;
		if((elapsed < 600) && (elapsed > 0)) {
			if(playing) hit();
		}
		else {
			if(playing) stand()
			else {
				newGame();
			}
		}
	});

	// Mouse controls.
	document.addEventListener("mousedown", function(event) {
		if(playing && event.which == 1) { // Left click for hit.
			hit();
		}
		else if(playing && event.which == 3) { // Right click for stand.
			stand();
		}
		else if(!playing && event.which == 1) { // Left click for yes, another game.
			newGame();
		}
	});
	// Prevent context menu show up on right click.
	document.addEventListener("contextmenu", function(event) {
    	event.preventDefault();
	}, false);

	// Keyboard controls.
	document.addEventListener("keydown", function(event) {
		if(playing && event.keyCode == 72) {        // H for hit.
			hit();
		}
		else if(playing && event.keyCode == 83) {  // S for stand.
			stand();
		}
		else if(!playing && event.keyCode == 89) { // Y for yes, another game.
			newGame();
		}
		else if(!playing && event.keyCode == 78) { // N for no and exit.
			exitToGitHub();
		}
		else if(event.keyCode == 27) { // Ecape key always exits.
			exitToGitHub();
		}
	});
};


