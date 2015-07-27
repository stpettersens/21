/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/JavaScript implementation
*/

/**
 * @file Cards class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Cards implements a collection of playing cards
 * and methods to draw and shuffle.
 * @constructor
*/
function Cards() {
	this.index = -1;
	this.deck_num = 52;
	this.deck = [];
	this.played = [];
	this.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
	this.suits = ['h', 'd', 'c', 's'];
}

/**
 * Get a rank for a card.
 * @private
 * @returns {string} Card rank.
*/
Cards.prototype._getRank = function() {
	var i = Math.floor(Math.random() * this.ranks.length);
	return this.ranks[i];
};

/**
 * Get a suit for a card.
 * @private
 * @returns {string} Card suit.
*/
Cards.prototype._getSuit = function() {
	var i = Math.floor(Math.random() * this.suits.length);
	return this.suits[i];
};

/** 
 * Get a card.
 * @private
 * @returns {string} Card as string.
*/
Cards.prototype._getCard = function() {
	return this._getRank() + ' ' + this._getSuit();
};

/**
 * Shuffle cards.
 * @public
*/
Cards.prototype.shuffle = function() {
	this.index = -1;
	this.deck = [];
	this.played = [];
	while(true) {
		var card = this._getCard();
		if(this.deck.indexOf(card) == -1) {
			this.deck.push(card);
			if(this.deck.length == this.deck_num) {
				break;
			}
		}
	}
};

/**
 * Draw a card.
 * @public
 * @returns {string} Drawn card as string.
*/
Cards.prototype.draw = function() {
	if(this.played.length == this.deck_num || this.index == -1) {
		this.index = 0;	
	}
	this.played.push(this.deck[this.index]);
	var rs = this.deck[this.index].split(' ');
	return '[' + rs[0] + rs[1] + ']';
};

/**
 * Get a card's value.
 * @public
 * @returns {number} Card's value.
*/
Cards.prototype.getValue = function() {
	var rs = this.deck[this.index].split(' ');
	this.index++;
	var value = 0;
	if(rs[0] == 'A') value = 1;
	else if(rs[0] == 'J' || rs[0] == 'Q' || rs[0] == 'K') value = 10;
	else value = parseInt(rs[0]);
	return value;
};

/**
 * Get number of played cards.
 * @public
 * @returns {number} Number of cards played.
*/
Cards.prototype.getPlayed = function() {
	return this.played.length;
};

/**
 * Draw all the cards from the deck.
 * @public
 * @returns {string[]} All cards from deck.
*/
Cards.prototype.drawAll = function() {
	this.index = 0
	var draws = [];
	for(var i = 0; i < this.deck_num; i++) {
		var d = this.draw();
		draws.push(d);
		this.index++;
	}
	this.index = -1;
	return draws;
};
