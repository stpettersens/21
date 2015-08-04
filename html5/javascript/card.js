/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
*/

/**
 * @file Card class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

var imageSrcs = [
'gfx/c.png',
'gfx/c10.png',
'gfx/c2.png',
'gfx/c3.png',
'gfx/c4.png',
'gfx/c5.png',
'gfx/c6.png',
'gfx/c7.png',
'gfx/c8.png',
'gfx/c9.png',
'gfx/cA.png',
'gfx/cJ.png',
'gfx/cK.png',
'gfx/cQ.png',
'gfx/d.png',
'gfx/d10.png',
'gfx/d2.png',
'gfx/d3.png',
'gfx/d4.png',
'gfx/d5.png',
'gfx/d6.png',
'gfx/d7.png',
'gfx/d8.png',
'gfx/d9.png',
'gfx/dA.png',
'gfx/dJ.png',
'gfx/dK.png',
'gfx/dQ.png',
'gfx/h10.png',
'gfx/h2.png',
'gfx/h3.png',
'gfx/h4.png',
'gfx/h5.png',
'gfx/h6.png',
'gfx/h7.png',
'gfx/h8.png',
'gfx/h9.png',
'gfx/hA.png',
'gfx/hJ.png',
'gfx/hK.png',
'gfx/hQ.png',
'gfx/s10.png',
'gfx/s2.png',
'gfx/s3.png',
'gfx/s4.png',
'gfx/s5.png',
'gfx/s6.png',
'gfx/s7.png',
'gfx/s8.png',
'gfx/s9.png',
'gfx/sA.png',
'gfx/sJ.png',
'gfx/sK.png',
'gfx/sQ.png'];


/**
 * Card represents a single playing card.
 * @constructor
 * @param {string} card - Data URI for card graphic.
 * @param {number} posX - X position for card.
 * @param {number} posX - Y position for card.
*/
function Card(card, posX, posY) {

	this.image = new Image();
	this.image.src = card;
	this.posX = posX;
	this.posY = posY;
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
		return 'gfx/' + card + '.png';
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
	return 'gfx/' + suit + rank + '.png';
}

/**
 * Get image data URI from card string pattern.
 * @public
 * @static
 * @param {string} card - String representation for card.
 * @returns {string} data URI for card graphic.
*/
Card.getImageData = function(card) {
	return graphics(imageSrcs.indexOf(Card.getImage(card)));
}

/**
 * Get source for image.
 * @public
 * @returns {string} Image source.
*/
Card.prototype.getImageSrc = function() {
	return this.image.src;
}

/** 
 * Set X, Y position for card.
 * @public
 * @param {number} posX - X position for card.
 * @param {number} poxY - Y position for card.
*/
Card.prototype.setXY = function(posX, posY) {
	this.posX = posX;
	this.posY = posY;
}

/**
 * Get X, Y position of card.
 * @public
 * @returns {number[]} X, Y position of card.
*/
Card.prototype.getXY = function() {
	return [this.posX, this.posY];
}

/**
 * Draw the card.
 * @public
*/
Card.prototype.draw = function() {
	var canvas = document.getElementById('blackjack-table');
	var context = canvas.getContext('2d');	
	context.drawImage(this.image, this.posX, this.posY, this.image.width, this.image.height);
}
