/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
*/

var debug = false;

function Score(debug, x, y) {
	debug = debug;
	this.x = x;
	this.y = y;
	this.score = '';

	_print('Created score counter at ' + this.x + ',' + this.y); // !
}

Score.prototype.emit = function(score) {
	this.clear();
	this.score = score;
};

Score.prototype.clear = function() {
	this.score = '';
};

Score.prototype.draw = function() {
	var canvas = document.getElementById('blackjack-table');
	var context = canvas.getContext('2d');
	context.font ='10pt Verdana';
	context.fillStyle = 'white';
	context.fillText(this.score, this.x, this.y);
};

function _print(message) {
	if(debug) console.log(message);
}

