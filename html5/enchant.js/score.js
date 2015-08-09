/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Score class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Score implements a score or information box.
 * @constructor
 * @param {boolean} debug - Enable debug messages?
 * @param {number} posX - X position for score box.
 * @param {number} posY - Y position for score box.
*/
function Score(debug, posX, posY) {
	this.box = new Label('');
	this.box.color = 'rgb(255, 255, 255)';
	this.box.font = '10pt verdana, sans-serif';
	this.box.x = posX;
	this.box.y = posY;
	this.box.width = 500;

	Debug.emit(debug, 'Created score counter at ' + posX + ',' + posY); // !
}

/**
 * Emit a score or similar message.
 * @public
 * @param {any} score - Score or similar message to emit.
*/
Score.prototype.emit = function(score) {
	this.clear();
	this.box.text = score;
}

/**
 * Clear the score box.
 * @public
*/
Score.prototype.clear = function() {
	this.box.text = '';
}

/**
 * Draw the score box.
 * @public
 * @returns {Label} The score box.
*/
Score.prototype.draw = function() {
	return this.box;
}
