/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Player class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Player implements the player for Blackjack.
 * @constructor
 * @param {boolean} debug - Enable debug messages?
 * @param {Object} game - Enchant.js game object.
*/
function Player(debug, game) {
	this.debug = debug;
	this.game = game;
	this.index = -1;
	this.pos = 225;
	this.cards = [];
	this.values = [];
}

/**
 * Calculate the total value of player's held cards.
 * @public
 * @returns {number} Total value of player's cards.
*/
Player.prototype.calcTotal = function() {
	this.values.sort(function(a, b) { return b - a });
	var total = 0
	for(var i = 0; i < this.values.length; i++) {
		var v = this.values[i];
		if(v == 1) {
			if((total + 11) <= 21) v = 11;
			if((total + 11) > 21) v = 1;
		}
		total += v;
	}
	return total;
};

/**
 * Determine if player has Blackjack.
 * @public
 * @returns {boolean} Does player have Blackjack?
*/
Player.prototype.hasBlackjack = function() {
	var blackjack = false;
	if(this.calcTotal() == 21) {
		Debug.emit(this.debug, 'Dealer has Blackjack!');
		blackjack = true;
	}
	return blackjack;
};

/**
 * Determine if player is bust.
 * @public
 * @returns {boolean} Is player bust?
*/
Player.prototype.isBust = function() {
	var bust = false;
	if(this.calcTotal() > 21) {
		Debug.emit(this.debug, 'Dealer is bust!');
		bust = true;
	}
	return bust;
};

/**
 * Receive cards from dealer.
 * @public
 * @param {string[]} Player's cards as string[].
 * @returns {Card[]} Player's cards as Card[].
*/
Player.prototype.receiveCards = function(player_cards) {
	var pc = '';
	for(var i = 0; i < player_cards.length; i++) {
		var cv = player_cards[i].split(':');
		this.cards.push(cv[0]);
		this.values.push(parseInt(cv[1]));
	}
	pc = this.cards[0] + this.cards[1];
	Debug.emit(this.debug, '\nPlayer receives their cards:');
	Debug.emit(this.debug, pc + ' --> ' + this.calcTotal().toString())

	this.index++;
	var cardA = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);

	this.index++;
	this.pos += 90;
	var cardB = new Card(Card.getImage(this.cards[this.index]), this.pos, 310, this.game);
	return [cardA, cardB];
};

/**
 * Player hits.
 * @public
 * @param {Cards} cards - Game cards.
 * @returns {Card} Player's drawn card.
*/
Player.prototype.hit = function(cards) {
	var card = cards.draw();
	this.cards.push(card);
	this.values.push(parseInt(cards.getValue()));
	this.index++;
	this.pos += 90;
	Debug.emit(this.debug, 'Player hits.');
	Debug.emit(this.debug, 'Player gets ' + card);
	Debug.emit(this.debug, 'Player has ' + this.calcTotal().toString());
	return new Card(Card.getImage(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), this.pos, 310, this.game); 
};

/**
 * Player stands.
 * @public
*/
Player.prototype.stand = function() {
	Debug.emit(this.debug, 'Player stands.');
	Debug.emit(this.debug, 'Player has ' + this.calcTotal().toString());
};

/**
 * Show player's cards.
 * @public
 * @returns {number} Total value of player's cards.
*/
Player.prototype.showCards = function() {
	this.index = 0;
	this.pos = 225;
	var cards = '';
	for(var i = 0; i < this.cards.length; i++) {
		cards += this.cards[i];
	}
	Debug.emit(this.debug, '\nPlayer has:');
	Debug.emit(this.debug, cards + ' --> ' + this.calcTotal().toString());
	return this.calcTotal();
};
