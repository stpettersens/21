/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Blackjack implementation in JavaScript.
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

var SCREEN_WIDTH = 780 + 220;
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
		newGame();

		/**
		 * Start a new game.
		*/
		function newGame() {
			//clear();
			playing = true;
			player_index = 2;
			player_cards = [];
			dealer_index = 2;
			dealer_cards = [];
			dealer_pile = new Card(Card.getImage('c'), 10, 10, game);
			screentip.clear();
			update();
			draw();
		}

		/**
		 * Update logic.
		*/
		function update() {
			// TODO
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
	};
	Debug.emit(debug, 'Initialized HTML5 Blackjack (enchant.js build).');
	game.start();
};
