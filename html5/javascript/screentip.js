/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/JavaScript implementation
*/

/**
 * @file Screentip class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Screentip implements a title and message box.
 * @constructor
 * @param {boolean} debug - Enable debug messages?
 * @param {number} posX - X position for screentip.
 * @param {number} posY - Y position for screentip.
*/
function Screentip(debug, posX, posY) {
	this.posX = posX;
	this.posY = posY;
	this.title = '';
	this.msg = '';

	Debug.emit(debug, 'Created screentip at ' + posX + ',' + posY); // !
}

/**
 * Emit a title and message.
 * @public
 * @param {string} title - Title to emit.
 * @param {string} message - Message to emit.
*/
Screentip.prototype.emit = function(title, message) {
	this.clear();
	this.title = title;
	this.msg = message;
};

/**
 * Clear the screentip.
 * @public
*/
Screentip.prototype.clear = function() {
	this.title = '';
	this.msg = '';
};

/**
 * Draw the screentip.
 * @public
*/
Screentip.prototype.draw = function() {
	if(this.msg == null) this.msg = '';
	if(this.title == null) this.title = '';
	var canvas = document.getElementById('blackjack-table');
	var context = canvas.getContext('2d');
	context.font ='10pt Verdana';
	context.fillStyle = 'white';
	context.fillText(this.title, this.posX, this.posY);
	context.fillText(this.msg, (this.posX - 45), (this.posY + 20));
};
