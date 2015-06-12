/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
*/

var debug = false;

function Player(debug) {
	debug = debug;
	this.index = -1;
	this.pos = 225;
	this.cards = [];
	this.values = [];
}

Player.prototype.calcTotal = function() {
	this.values.sort(function(a, b) { return b - a });
	var total = 0
	for(var i = 0; i < this.values.length; i++) {
		var v = this.values[i];
		if(v == 1) {
			if((total + 11) <= 21) v = 11;
			if((total + 11) > 21) v = 1;
		}
		total += v;
	}
	return total;
};

Player.prototype.hasBlackjack = function() {
	var blackjack = false;
	if(this.calcTotal() == 21) {
		_print('Dealer has Blackjack!');
		blackjack = true;
	}
	return blackjack;
};

Player.prototype.isBust = function() {
	var bust = false;
	if(this.calcTotal() > 21) {
		_print('Dealer is bust!');
		bust = true;
	}
	return bust;
};

Player.prototype.receiveCards = function(player_cards) {
	var pc = '';
	for(var i = 0; i < player_cards.length; i++) {
		var cv = player_cards[i].split(':');
		this.cards.push(cv[0]);
		this.values.push(parseInt(cv[1]));
	}
	pc = '[' + this.cards[0] + '][' + this.cards[1] + ']';
	_print('\nPlayer receives their cards:');
	_print(pc + ' --> ' + this.calcTotal().toString())

	this.index++;
	var cardA = new Card(Card_getImageData(this.cards[this.index]), this.pos, 310);

	this.index++;
	this.pos += 90;
	var cardB = new Card(Card_getImageData(this.cards[this.index]), this.pos, 310);
	return [cardA, cardB];
};

Player.prototype.hit = function(cards) {
	var card = cards.draw();
	this.cards.push(card);
	this.values.push(parseInt(cards.getValue()));
	this.index++;
	this.pos += 90;
	_print('Player hits.');
	_print('Player gets ' + card);
	_print('Player has ' + this.calcTotal().toString());
	return new Card(Card_getImageData(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), this.pos, 310); 
};

Player.prototype.stand = function() {
	_print('Player stands.');
	_print('Player has ' + this.calcTotal().toString());
};

Player.prototype.showCards = function() {
	this.index = 0;
	this.pos = 225;
	var cards = '';
	for(var i = 0; i < this.cards.length; i++) {
		cards += '[' + this.cards[i] + ']';
	}
	_print('\nPlayer has:');
	_print(cards + ' --> ' + this.calcTotal().toString());
	return this.calcTotal();
};

function _print(message) {
	if(debug) console.log(message);
}
