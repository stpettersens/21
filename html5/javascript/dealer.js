/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
*/

var debug = false;

function Dealer(debug) {
	debug = debug;
	this.index = 0;
	this.pos = 225;
	this.cards = [];
	this.values = [];
}

Dealer.prototype.calcTotal = function() {
	this.values.sort(function(a, b) { return b - a })
	var total = 0
	for(var i = 0; i < this.values.length; i++) {
		var v = this.values[i];
		if(v == 1) {
			if((total + 11) <= 21) v = 11;
			else if((total + 11) > 21) v = 1;
		}
		total += v;
	}
	return total;
};

Dealer.prototype._hit = function(cards) {
	this.index++;
	this.pos += 90;
	var card = cards.draw();
	this.cards.push(card);
	this.values.push(cards.getValue());
	_print('Dealer hits.');
	_print('Dealer gets ' + card);
	return new Card(Card_getImageData(card), this.pos, 10);
};

Dealer.prototype._stand = function() {
	_print('Dealer stands.');
};

Dealer.prototype.shuffle = function(cards) {
	if(cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
		_print('-------------------------------------------------------');
		_print('Dealer is shuffling cards...');
		_print('-------------------------------------------------------');
		return cards.shuffle();
	}
};

Dealer.prototype.deal = function(cards) {
	var dealt = [];
	var i = 1;
	_print('-------------------------------------------------------');
	_print('Dealer is dealing cards for a new game...');
	_print('-------------------------------------------------------');
	while(i <= (2 * 2)) {
		dealt.push(cards.draw() + ':' + cards.getValue());
		i++;
	}
	i = 0;
	while(i < 2) {
		var cv = dealt[i].split(':');
		this.cards.push(cv[0]);
		this.values.push(parseInt(cv[1]));
		i++;
	}
	_print('\nDealer has:');
	_print('[**]' + this.cards[1]);
	return [dealt[2], dealt[3]];
};

Dealer.prototype.hasBlackjack = function() {
	var blackjack = false;
	if(this.calcTotal() == 21) {
		_print('Dealer has Blackjack!');
		blackjack = true;
	}
	return blackjack;
};

Dealer.prototype.isBust = function() {
	var bust = false;
	if(this.calcTotal() > 21) {
		_print('Dealer is bust!');
		bust = true;
	}
	return bust;
};

Dealer.prototype.respond = function(cards) {
	this.showCards();
	var responding = true;
	var response_cards = [];
	while(responding) {
		var total = 0;
		while(total <= 18) {
			total = this.calcTotal();
			if(total == 16) {
				if(Math.floor(Math.random() * 6) >= 3) {
					response_cards.push(this._hit(cards)); // Take risk.
				}
				else {
					this._stand(); // Play it safe. 
				}
			}
			else if(total >= 17) {
				this._stand();
				responding = false;
				break;
			}
			else {
				response_cards.push(this._hit(cards));
			}
		}
	}
	return response_cards;
};

Dealer.prototype.showCards = function() {
	this.index = 0;
	this.pos = 225;
	var cards = '';
	for(var i = 0; i < this.cards.length; i++) {
		cards += '[' + this.cards[i] + ']';
	}
	_print('\nDealer has:');
	_print(cards + ' --> ' + this.calcTotal().toString());
	return this.calcTotal();
};

Dealer.prototype.receiveCards = function() {
	this.index++;
	var cardA = new Card(Card_getImageData('c'), this.pos, 10);
	this.index++;
	this.pos += 90;
	var cardB = new Card(Card_getImageData(this.cards[1]), this.pos, 10);
	return [cardA, cardB];
};

Dealer.prototype.revealFirstCard = function() {
	return new Card(Card_getImageData(this.cards[0]), 225, 10);
};

function _print(message) {
	if(debug) console.log(message);
}
