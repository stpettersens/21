/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
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
function Score(debug, posX, posY) {;
	this.posX = posX;
	this.posY = posY;
	this.score = '';

	Debug.emit(debug, 'Created score counter at ' + posX + ',' + posY); // !
}

/**
 * Emit a score or similar message.
 * @public
 * @param {any} score - Score or similar message to emit.
*/
Score.prototype.emit = function(score) {
	this.clear();
	this.score = score;
};

/**
 * Clear the score box.
 * @public
*/
Score.prototype.clear = function() {
	this.score = '';
};

/**
 * Draw the score box.
 * @public
*/
Score.prototype.draw = function() {
	var box = new Label(this.score);
	box.color = 'rgb(255, 255, 255)';
	box.x = this.posX;
	box.y = this.posY;
	return box;
};
