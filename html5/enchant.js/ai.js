/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file AI class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * AI implements an artificial player (not the dealer).
 * @constructor
 * @param {boolean} debug - Enable debug messages?
 * @param {Object} game - Enchant.js game object.
*/
function AI(debug, game) {
	this.debug = debug;
	this.game = game;
	this.index = 0;
	this.pos = 225;
	this.cards = [];
	this.values = [];
}

/**
 * Calculate the total value of AI's held cards.
 * @public
 * @returns {number} Total value of AI's cards.
*/
AI.prototype.calcTotal = function() {
	this.values.sort(function(a, b) { return b - a });
	var total = 0;
	for(var i = 0; i < this.values.length; i++) {
		var v = this.values[i];
		if(v == 1) {
			if((total + 11) <= 21) v = 11;
			if((total + 11) > 21) v = 1
		}
		total += v
	}
	return total
}

/**
 * Determine if AI has Blackjack.
 * @public
 * @returns {boolean} Does AI have Blackjack?
*/
AI.prototype.hasBlackjack = function() {
	var blackjack = false;
	if(this.calcTotal() == 21) {
		Debug.emit(this.debug, 'AI has Blackjack!');
		blackjack = true;
	}
	return blackjack;
}

/**
 * Determine if AI is bust.
 * @public
 * @returns {boolean} Is AI bust?
*/
AI.prototype.isBust = function() {
	var bust = false;
	if(this.calcTotal() > 21) {
		Debug.emit(this.debug, 'AI is bust!');
		bust = true;
	}
	return bust;
}

/**
 * Receive cards from dealer.
 * @public
 * @param {string[]} ai_cards - AI's cards as string[].
 * @returns {Card[]} AI's cards as Card[].
*/
AI.prototype.receiveCards = function(ai_cards) {
	var ac = '';
	for(var i = 0; i < ai_cards.length; i++) {
		var cv = ai_cards[i].split(":");
		this.cards.push(cv[0]);
		this.values.push(parseInt(cv[1]));
	}
	ac = this.cards[0] + this.cards[1];
	Debug.emit(this.debug, '\nAI receives their cards:');
	Debug.emit(this.debug, ac + ' --> ' + this.calcTotal().toString());
	this.index++;
	var cardA = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);
	this.pos += 90;
	this.index++;
	var cardB = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);
	return [cardA, cardB];
}

/**
 * AI hits.
 * @private
 * @param {Cards} cards - Game cards.
 * @returns {Card} AI's drawn card.
*/
AI.prototype._hit = function(cards) {
	var card = cards.draw();
	this.cards.push(card);
	this.values.push(cards.getValue());
	this.index++;
	this.pos += 90;
	Debug.emit(this.debug, 'AI hits.');
	Debug.emit(this.debug, 'AI gets ' + card);
	Debug.emit(this.debug, 'AI has ' + this.calcTotal().toString());
	return new Card(Card.getImage(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), this.pos, 310, this.game);
}

/**
 * AI stands.
 * @private
*/
AI.prototype._stand = function() {
	Debug.emit(this.debug, 'AI stands.');
	Debug.emit(this.debug, 'AI has ' + this.calcTotal().toString());
}

/**
 * AI responds to cards received or dealer.
 * @param {Cards} cards - Game cards.
 * @returns {Card[]} Response cards.
*/
AI.prototype.respond = function(cards) {
	this.showCards();
	var responding = true;
	var response_cards = [];
	while(responding) {
		var total = 0;
		while(total <= 18) {
			total = this.calcTotal();
			if(total == 16) {
				if(Math.floor(Math.random() * 6) >= 3) {
					this.index++;
					this.pos += 90;
					response_cards.push(this._hit(cards)); // Take risk.
				}
				else
					this._stand(); // Play it safe.
			}
			else if(total >= 17) {
				this._stand();
				responding = false;
				break;
			}
			else {
				this.index++;
				this.pos += 90;
				response_cards.push(this._hit(cards));
			}
		}
	}
	return response_cards;
}

/**
 * Show AI's cards.
 * @returns {number} Total value of AI's cards.
*/
AI.prototype.showCards = function() {
	this.index = 0;
	this.pos = 225;
	var cards = '';
	for(var i = 0; i < this.cards.length; i++) {
		cards += this.cards[i];
	}
	Debug.emit(this.debug, '\nAI has:');
	Debug.emit(this.debug, cards + ' --> ' + this.calcTotal().toString());
	return this.calcTotal();
}
