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

var debug = false;

/**
 * Score implements a score or information box.
 * @constructor
 * @param {boolean} debug - Enable debug messages?
 * @param {number} posX - X position for score box.
 * @param {number} posY - Y position for score box.
*/
function Score(debug, posX, posY) {
	debug = debug;
	this.posX = posX;
	this.posY = posY;
	this.score = '';

	_print('Created score counter at ' + posX + ',' + posY); // !
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
	var canvas = document.getElementById('blackjack-table');
	var context = canvas.getContext('2d');
	context.font ='10pt Verdana';
	context.fillStyle = 'white';
	context.fillText(this.score, this.x, this.y);
};

/**
 * Print a debug message.
 * @param {any} message - Message to print.
*/
function _print(message) {
	if(debug) console.log(message);
}
