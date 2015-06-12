/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
*/

var debug = false;

function Screentip(debug, x, y) {
	debug = debug;
	this.x = x;
	this.y = y;
	this.title = '';
	this.msg = '';

	_print('Created screentip at ' + this.x + ',' + this.y); // !
}

Screentip.prototype.emit = function(title, message) {
	this.clear();
	this.title = title;
	this.msg = message;
};

Screentip.prototype.clear = function() {
	this.title = '';
	this.msg = '';
};

Screentip.prototype.draw = function() {
	if(this.msg == null) this.msg = '';
	if(this.title == null) this.title = '';
	var canvas = document.getElementById('blackjack-table');
	var context = canvas.getContext('2d');
	context.font ='10pt Verdana';
	context.fillStyle = 'white';
	context.fillText(this.title, this.x, this.y);
	context.fillText(this.msg, (this.x - 45), (this.y + 20));
};

function _print(message) {
	if(debug) console.log(message);
}

