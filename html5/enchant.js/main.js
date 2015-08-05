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

var debug = false;
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

var SCREEN_WIDTH = 780;
var SCREEN_HEIGHT = 500;

/**
 * @function Main function.
*/
window.onload = function() {
	var stage = document.getElementById('enchant-stage');
	stage.style.marginLeft = 'auto';
	stage.style.marginRight = 'auto';
	stage.style.border = '1px dotted rgb(0, 0, 0)';
	enchant();
	var game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);
	var content = graphics.concat(sounds);
	Debug.emit(debug, 'Loading assets:');
	Debug.emit(debug, content);
	game.preload(content);
	game.onload = function() {
		var scene = new Scene();
		scene.backgroundColor = 'rgb(0, 153, 0)';

		screentip = new Screentip(debug, ((SCREEN_WIDTH / 2) - 60), 190);
		instruction = new Score(debug, ((SCREEN_WIDTH / 2) - 200), 450);
		p_score = new Score(debug, 153, 315);
		d_score = new Score(debug, 153, 25);
		cards = new Cards();
		game.sfx = toggleSoundEffects();
		game.sfxHit = game.assets['sounds/hit.ogg'];
		newGame();

		/**
		 * Is the game running on a touch screen device?
		 * @returns {boolean} Is touch screen device?
		*/
		function isTouchScreenDevice() {
			var touch = false;
			var ua = navigator.userAgent;
			if(ua.indexOf('Mobile') !== -1 || ua.indexOf('Tablet') !== -1)
				touch = true;

			return touch;
		}

		/**
		 * Does the browser support sound effects?
		 * (Disable on WebKit based due to bug).
		 * @returns {boolean} Are sound effects enabled?
		*/
		function toggleSoundEffects() {
			var effects = true;
			var ua = navigator.userAgent;
			if(ua.indexOf('WebKit') !== -1) {
				effects = false;
				alert('Sound effects disabled due to bug ' 
			 	+ 'occurring with this browser.');
			}

			return effects;
		}

		/**
		 * Show cards at end of game.
		*/
		function showCards() {
			playing = false;
			dealer_cards[0] = dealer.revealFirstCard();
			var ds = dealer.showCards();
			var ps = player.showCards();

			if(ps === 21 && player_index === 2 && ds !== 21)
				screentip.emit('PLAYER BLACKJACK!', 'Player has 21. That\'s a Blackjack!');

			else if(ds === 21 && dealer_index === 2 && ps !== 21)
				screentip.emit('DEALER BLACKJACK!', 'Dealer has 21. That\'s a Blackjack!');

			else if((ps == ds) || (ps > 21 && ds > 21))
				screentip.emit('PUSH', 'Neither dealer nor player won.');

			else if(ps <= 21 && ps > ds)
				screentip.emit('PLAYER WINS', 'Player wins with ' + ps.toString() + '. Well done.');

			else if(ds <= 21 && ds > ps)
				screentip.emit('DEALER WINS', 'Dealer wins with ' + ds.toString() + '. Too bad.');

			else if(ps > 21 && ds <= 21)
				screentip.emit('DEALER WINS', 'Dealer wins. Player bust.');

			else if(ds > 21 && ps <= 21)
				screentip.emit('PLAYER WINS', 'Player wins. Dealer bust.');

			if(cards.getPlayed() == 52)
				dealer_pile = new Card(Card.getImage('d'), 10, 10, game);

			Debug.emit(debug, 'Cards played ' + cards.getPlayed().toString());
			d_score.emit(dealer.calcTotal());
			if(!isTouchScreenDevice())
				instruction.emit('Play again? Yes [Y key or LMB] or No [N key or Escape key].');

			else
				instruction.emit('Play again? Long tap screen to continue.');

			draw();
		}

		/**
		 * Start a new game.
		*/
		function newGame() {
			clear();
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
		 * Clear the table.
		*/
		function clear() {
			scene.removeChild(screentip.draw()[0]);
			scene.removeChild(screentip.draw()[1]);
			scene.removeChild(instruction.draw());
			scene.removeChild(p_score.draw());
			scene.removeChild(d_score.draw());
			for(var i = 0; i < player_cards.length; i++) {
				scene.removeChild(player_cards[i].draw());
			}
			for(var i = 0; i < dealer_cards.length; i++) {
				scene.removeChild(dealer_cards[i].draw());
			}
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
				if(game.sfx) game.sfxHit.play();
				player_cards[player_index] = player.hit(cards);
				player_index++;
				update();
			}
			draw();
		}

		/**
		 * Take a stand.
		*/
		function stand() {
			player.stand();
			var received = dealer.respond(cards);
			for(var i = 0; i < received.length; i++) {
				var xy = dealer_cards[dealer_index].getXY();
				dealer_cards[dealer_index] = received[i];
				dealer_cards[dealer_index].setXY(xy[0], xy[1]);
				Debug.emit(debug, 'Added image at ' + xy[0].toString() + ',' + xy[1].toString());
				Debug.emit(debug, dealer_index);
				dealer_index++;
			}
			showCards();
		}

		/**
		 * Exit to project's repository on GitHub.
		*/
		function exitToGitHub() {
			window.location.href = 'https://github.com/stpettersens/21';
		}

		// Touch controls.
		var start = null;
		stage.addEventListener('touchstart', function(event) {
			event.preventDefault();
			start = new Date().getTime();
		});

		stage.addEventListener('touchend', function(event) {
			event.preventDefault();
			var elapsed = new Date().getTime() - start;
			if((elapsed < 600) && (elapsed > 0))
				if(playing) hit();

			else
				if(playing) stand();
				else newGame();
		});

		// Mouse controls.
		stage.addEventListener('mousedown', function(event) {
			if(playing && event.which === 1)
				hit();

			else if(playing && event.which === 3)
				stand();

			else if(!playing && event.which === 1)
				newGame();
		});
		// Prevent context menu show up on right click.
		stage.addEventListener('contextmenu', function(event) {
			event.preventDefault();
		}, false);

		// Keyboard controls.
		document.addEventListener('keydown', function(event) {
			if(playing && event.keyCode === 72)
				hit();

			else if(playing && event.keyCode === 83)
				stand();

			else if(!playing && event.keyCode === 89)
				newGame();

			else if(!playing && event.keyCode === 78)
				exitToGitHub();

			else if(event.keyCode === 27)
				exitToGitHub();
		});
	};
	Debug.emit(debug, 'Initialized HTML5 Blackjack (enchant.js build).');
	game.start();
};
