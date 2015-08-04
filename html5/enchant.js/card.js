/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Card class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Card represents a single playing card.
 * @constructor
 * @param {string} card - Data URI for card graphic.
 * @param {number} posX - X position for card.
 * @param {number} posX - Y position for card.
 * @param {Object} game - Enchant.js game object.
*/
function Card(card, posX, posY, game) {
	this.game = game;
	this.sprite = new Sprite(71, 96);
	this.sprite.image = this.game.assets[card];
	this.sprite.x = posX;
	this.sprite.y = posY;
	this.src = card;
}

/**
 * Get image path from card string pattern.
 * @public
 * @static
 * @param {string} card - Card string pattern.
 * @returns {string} Path for card image.
*/
Card.getImage = function(card) {
	if(card == 'c' || card == 'd') {
		return g + card + '.png';
	}
	var suit = '';
	if(new RegExp('(h)').test(card)) {
		suit = 'h';
	}
	else if(new RegExp('(d)').test(card)) {
		suit = 'd';
	}
	else if(new RegExp('(c)').test(card)) {
		suit = 'c';
	}
	else if(new RegExp('(s)').test(card)) {
		suit = 's';
	}
	var rank = card.match(/\[*([0-9A-Z]*)\]*/)[1];
	return g + suit + rank + '.png';
}

/**
 * Get source for image.
 * @public
 * @returns {string} Image source.
*/
Card.prototype.getImageSrc = function() {
	return this.src;
}

/** 
 * Set X, Y position for card.
 * @public
 * @param {number} posX - X position for card.
 * @param {number} poxY - Y position for card.
*/
Card.prototype.setXY = function(posX, posY) {
	this.sprite.x = posX;
	this.sprite.y = posY;
}

/**
 * Get X, Y position of card.
 * @public
 * @returns {number[]} X, Y position of card.
*/
Card.prototype.getXY = function() {
	return [this.sprite.x, this.sprite.y];
}

/**
 * Draw the card.
 * @public
*/
Card.prototype.draw = function() {
	return this.sprite;
}
