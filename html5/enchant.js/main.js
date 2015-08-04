/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Blackjack implementation with enchant.js
 * @copyright 2015 Sam Saint-Pettersen
*/

var debug = true;
var ai = false;
var playing = true;
var player_index = 2;
var player_cards = [];
var dealer_index = 2;
var dealer_cards = [];
var screentip = null;
var instruction = null;
var p_score = null;
var d_score = null;
var dealer_pile = null;
var cards = null;
var player = null;
var dealer = null;
var timer = 0;

var SCREEN_WIDTH = 780 + 400;
var SCREEN_HEIGHT = 500;

/**
 * @function Main function.
*/
window.onload = function() {
	enchant();
	var game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.preload(graphics);
	game.onload = function() {
		var scene = new Scene();
		scene.backgroundColor = 'rgb(0, 153, 0)';

		screentip = new Screentip(debug, ((SCREEN_WIDTH / 2) - 50), 190);
		instruction = new Score(debug, ((SCREEN_WIDTH / 2) - 155), 450);
		p_score = new Score(debug, 153, 315);
		d_score = new Score(debug, 153, 25);
		cards = new Cards();
		newGame();

		/**
		 * Start a new game.
		*/
		function newGame() {
			//clear();
			playing = true;
			player_index = 2;
			player_cards = new Array(5);
			dealer_index = 2;
			dealer_cards = new Array(5);
			dealer_pile = new Card(Card.getImage('c'), 10, 10, game);
			screentip.clear();
			player = new Player(debug, game);
			dealer = new Dealer(debug, game);
			dealer.shuffle(cards);
			player_cards = player.receiveCards(dealer.deal(cards));
			dealer_cards = dealer.receiveCards();
			player_cards[2] = new Card(Card.getImage('d'), 405, 310, game);
			player_cards[3] = new Card(Card.getImage('d'), 495, 310, game);
			player_cards[4] = new Card(Card.getImage('d'), 585, 310, game);
			dealer_cards[2] = new Card(Card.getImage('d'), 405, 10, game);
			dealer_cards[3] = new Card(Card.getImage('d'), 495, 10, game);
			dealer_cards[4] = new Card(Card.getImage('d'), 585, 10, game);
 			update();
			draw();
		}

		/**
		 * Update logic.
		*/
		function update() {
			if(hasBlackjack() || isBust())
				showCards();

			p_score.emit(player.calcTotal());

			if(playing) {
				d_score.emit('?');
				instruction.emit('Hit [H key or LMB] or Stand [S key or RMB]?');
			}
		}

		/**
		 * Draw logic.
		*/
		function draw() {
			//clear();
			scene.addChild(dealer_pile.draw());
			scene.addChild(screentip.draw()[0]);
			scene.addChild(screentip.draw()[1]);
			scene.addChild(instruction.draw());
			scene.addChild(p_score.draw());
			scene.addChild(d_score.draw());
			for(var i = 0; i < player_cards.length; i++) {
				scene.addChild(player_cards[i].draw());
			}
			for(var i = 0; i < dealer_cards.length; i++) {
				scene.addChild(dealer_cards[i].draw());
			}
			game.pushScene(scene);
		}

		/**
		 * Determine if a Blackjack has occurred.
		 * @returns {boolean} Has a Blackjack occurred?
		*/
		function hasBlackjack() {
			var blackjack = false;
			if(player.hasBlackjack() || dealer.hasBlackjack())
				blackjack = true;

			return blackjack;
		}

		/**
		 * Determine if a bust has occurred.
		 * @returns {boolean} Has a bust occurred?
		*/
		function isBust() {
			var bust = false;
			if(player.isBust() || dealer.isBust())
				bust = true;

			return bust;
		}

		/**
		 * Take a hit.
		*/
		function hit() {
			if(player_index < 6) {
				player_cards[player_index] = player.hit(cards);
				player_index++;
				update();
			}
			draw();
		}

	};
	Debug.emit(debug, 'Initialized HTML5 Blackjack (enchant.js build).');
	game.start();
};
