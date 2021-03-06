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

var ai = false;
var sound = true;
var playing = true;
var playerIndex = 2;
var playerCards = [];
var dealerIndex = 2;
var dealerCards = [];
var screentip = null;
var instruction = null;
var pScore = null;
var dScore = null;
var pBalance = null;
var wChips = null;
var rChips = null;
var bChips = null;
var gChips = null;
var blChips = null;
var dealerPile = null;
var cards = null;
var player = null;
var dealer = null;
var chips = null;
var toggle_sound = null;
var balance = 1000;
var bet = 0;
var timer = 0;

var SCREEN_WIDTH = 820; // 780
var SCREEN_HEIGHT = 560; // 560
var DEBUG = true;

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
	Debug.emit(DEBUG, 'Loading assets:');
	Debug.emit(DEBUG, content);
	game.preload(content);
	game.onload = function() {
		var scene = new Scene();
		scene.backgroundColor = 'rgb(0, 153, 0)';

		screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 60), 190);
		instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 200), 450);
		pScore = new Score(DEBUG, 153, 315);
		dScore = new Score(DEBUG, 153, 25);
		pBalance = new Score(DEBUG, 10, 410);
		wChips = new Score(DEBUG, 10, 430);
		rChips = new Score(DEBUG, 10, 450);
		bChips = new Score(DEBUG, 10, 470);
		gChips = new Score(DEBUG, 10, 490);
		blChips = new Score(DEBUG, 10, 510);
		chips = new Chips();
		cards = new Cards();
		game.sfx = enchantSFXSupported();
		toggle_sound = new Score(DEBUG, 600, 15);
		player = new Player(DEBUG);
		dealer = new Dealer(DEBUG);
		dealerPile = new Card(Card.getImage('c'), 10, 10, game);
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
		 * Toggle sound effects on/off.
		*/
		function toggleSound() {
			sound = SoundEffects.toggle();
			Debug.emit(DEBUG, "----------------------------------------------------");
			Debug.emit(DEBUG, "Sound effects on: " + sound);
			Debug.emit(DEBUG, "----------------------------------------------------");
			update();
		}

		/**
		 * Does the browser support sound effects via enchant.js?
		 * @returns {boolean} Are sound effects supported via enchant.js?
		*/
		function enchantSFXSupported() {
			var effects = true;
			var ua = navigator.userAgent;
			if(ua.indexOf('WebKit') !== -1)
				effects = false;

			return effects;
		}

		/**
		 * Place a bet.
		*/
		function placeBet() {
			if(balance == 0) {
				balance = 1000;
				var response = confirm('Out of chips. Play again?');
				if(response) {
					alert('Received $' + balance + ' in chips.');
				}
			}
			var response = prompt('Place bet ($):', '0');
			if(!isNaN(response)) {
				bet = parseInt(response);
				if(bet > 0 && bet <= balance) {
					balance -= bet;
					Debug.emit(DEBUG, "Placed bid of $" + bet);
					newGame();
				}
				else {
					alert('Bet must between $1 and $' + balance);
					placeBet();
				}
			}
			else {
				alert('Bet must be numeric value.');
				placeBet();
			}
		}

		/**
		 * Start the first game.
		*/
		function startFirstGame() {
			playing = false;
			playerCards = new Array(5);
			dealerCards = new Array(5);

			screentip.clear();
			instruction.emit('Press P key  or left click to start a new game.');
			chips.deal(balance);
			update();
			draw();
		}

		/**
		 * Show cards at end of game.
		*/
		function showCards() {
			playing = false;
			dealerCards[0] = dealer.revealFirstCard();
			var ds = dealer.showCards();
			var ps = player.showCards();
			var betWon = false;
			var refundBet = false;

			if(ps === 21 && playerIndex === 2 && ds !== 21) {
				screentip.emit('PLAYER BLACKJACK!', 'Player has 21. That\'s a Blackjack!');
				betWon = true;
			}

			else if(ds === 21 && dealerIndex === 2 && ps !== 21)
				screentip.emit('DEALER BLACKJACK!', 'Dealer has 21. That\'s a Blackjack!');

			else if((ps == ds) || (ps > 21 && ds > 21))
				screentip.emit('PUSH', 'Neither dealer nor player won.');

			else if(ps <= 21 && ps > ds) {
				screentip.emit('PLAYER WINS', 'Player wins with ' + ps.toString() + '. Well done.');
				refundBet = true;
			}

			else if(ds <= 21 && ds > ps)
				screentip.emit('DEALER WINS', 'Dealer wins with ' + ds.toString() + '. Too bad.');

			else if(ps > 21 && ds <= 21)
				screentip.emit('DEALER WINS', 'Dealer wins. Player bust.');

			else if(ds > 21 && ps <= 21) {
				screentip.emit('PLAYER WINS', 'Player wins. Dealer bust.');
				betWon = true;
			}

			if(cards.getPlayed() == 52)
				dealerPile = new Card(Card.getImage('d'), 10, 10, game);

			Debug.emit(DEBUG, 'Cards played ' + cards.getPlayed().toString());
			dScore.emit(dealer.calcTotal());
			if(!isTouchScreenDevice())
				instruction.emit('Play again? Yes [Y key or LMB] or No [N key or Escape key].');

			else
				instruction.emit('Play again? Long tap screen to continue.');

			if(betWon)
				balance += (bet * 2); // Player wins bet; receives their bet + dealer's.
			else if(refundBet)
				balance += bet; // Player's bet is refunded on a push.

			chips.deal(balance);
			draw();
		}

		/**
		 * Start a new game.
		*/
		function newGame() {
			clear();
			playing = true;
			playerIndex = 2;
			playerCards = new Array(5);
			dealerIndex = 2;
			dealerCards = new Array(5);
			screentip.clear();
			player = new Player(DEBUG, game);
			dealer = new Dealer(DEBUG, game);
			dealer.shuffle(cards);
			playerCards = player.receiveCards(dealer.deal(cards));
			dealerCards = dealer.receiveCards();
			playerCards[2] = new Card(Card.getImage('d'), 405, 310, game);
			playerCards[3] = new Card(Card.getImage('d'), 495, 310, game);
			playerCards[4] = new Card(Card.getImage('d'), 585, 310, game);
			dealerCards[2] = new Card(Card.getImage('d'), 405, 10, game);
			dealerCards[3] = new Card(Card.getImage('d'), 495, 10, game);
			dealerCards[4] = new Card(Card.getImage('d'), 585, 10, game);
 			update();
			draw();
		}

		/**
		 * Update logic.
		*/
		function update() {
			if(sound)				
				toggle_sound.emit('Turn sound off [E key]');
			else
				toggle_sound.emit('Turn sound on [E key]');
	
			if(hasBlackjack() || isBust() || playerIndex == 5)
				showCards();

			var score = player.calcTotal();
			if(score > 0) pScore.emit(score);
			pScore.emit('Balance: $' + balance);

			var chipVals = chips.getValues();
			var chipNums = chips.getNums();
			wChips.emit('White chips ($' + chipVals[0] + '): ' + chipNums[0]);
			rChips.emit('Red chips ($' + chipVals[1] + '): ' + chipNums[1]);
			bChips.emit('Blue chips ($' + chipVals[2] + '): ' + chipNums[2]);
			gChips.emit('Green chips ($' + chipVals[3] + '): ' + chipNums[3]);
			blChips.emit('Black chips ($' + chipVals[4] + '): ' + chipNums[4]);

			if(playing) {
				dScore.emit('?');
				instruction.emit('Hit [H key or LMB] or Stand [S key or RMB]?');
			}
		}

		/**
		 * Draw logic.
		*/
		function draw() {
			scene.addChild(toggle_sound.draw());
			scene.addChild(dealerPile.draw());
			scene.addChild(screentip.draw()[0]);
			scene.addChild(screentip.draw()[1]);
			scene.addChild(instruction.draw());
			scene.addChild(pScore.draw());
			scene.addChild(dScore.draw());
			scene.addChild(pBalance.draw());
			scene.addChild(wChips.draw());
			scene.addChild(rChips.draw());
			scene.addChild(bChips.draw());
			scene.addChild(gChips.draw());
			scene.addChild(blChips.draw());
			for(var i = 0; i < playerCards.length; i++) {
				if(playerCards[i] != null) {
					scene.addChild(playerCards[i].draw());
					scene.addChild(dealerCards[i].draw());
				}
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
			scene.removeChild(pScore.draw());
			scene.removeChild(dScore.draw());
			scene.removeChild(pBalance.draw());
			scene.removeChild(wChips.draw());
			scene.removeChild(rChips.draw());
			scene.removeChild(bChips.draw());
			scene.removeChild(gChips.draw());
			scene.removeChild(blChips.draw());
			for(var i = 0; i < playerCards.length; i++) {
				if(playerCards[i] != null) {
					scene.removeChild(playerCards[i].draw());
					scene.removeChild(dealerCards[i].draw());
				}
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
			if(playerIndex < 6) {
				SoundEffects.play(game, 'hit');
				playerCards[playerIndex] = player.hit(cards);
				playerIndex++;
				update();
			}
			else stand();
			draw();
		}

		/**
		 * Take a stand.
		*/
		function stand() {
			player.stand();
			var received = dealer.respond(cards);
			for(var i = 0; i < received.length; i++) {
				var xy = dealerCards[dealerIndex].getXY();
				dealerCards[dealerIndex] = received[i];
				dealerCards[dealerIndex].setXY(xy[0], xy[1]);
				Debug.emit(DEBUG, 'Added image at ' + xy[0].toString() + ',' + xy[1].toString());
				Debug.emit(DEBUG, dealerIndex);
				dealerIndex++;
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

			else if(!playing && (event.keyCode === 89 || event.keyCode == 80))
				newGame(); //placeBet();

			else if(!playing && event.keyCode === 78)
				exitToGitHub();

			else if(event.keyCode === 27)
				exitToGitHub();

			else if(event.keyCode == 69)
				toggleSound();
		});
	};
	Debug.emit(DEBUG, 'Initialized HTML5 Blackjack (enchant.js build).');
	game.start();
};
