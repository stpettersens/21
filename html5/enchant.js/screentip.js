/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
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
	var st_title = new Label(this.title);
	var st_msg = new Label(this.msg);
	st_title.color = 'rgb(255, 255, 255)';
	st_title.font = '10pt verdana, sans-serif';
	st_title.x = this.posX;
	st_title.y = this.posY;
	st_msg.color = st_title.color;
	st_msg.font = st_title.font;
	st_msg.x = this.posX - 45;
	st_msg.y = this.posY + 20;
	return [st_title, st_msg];
};
