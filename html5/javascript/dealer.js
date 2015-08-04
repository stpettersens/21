/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5 implementation
*/

/**
 * @file Dealer class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Dealer implements the dealer for Blackjack.
 * @constructor
 * @param {boolean} debug - Enable debug messages?
*/
function Dealer(debug) {
	this.debug = debug;
	this.index = 0;
	this.pos = 225;
	this.cards = [];
	this.values = [];
}

/**
 * Calculate the total value of dealer's held cards.
 * @public
 * @returns {number} Total value of dealer's cards.
*/
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

/**
 * Dealer hits.
 * @private
 * @param {Cards} cards - Game cards.
 * @returns {Card} Dealer's drawn card.
*/
Dealer.prototype._hit = function(cards) {
	this.index++;
	this.pos += 90;
	var card = cards.draw();
	this.cards.push(card);
	this.values.push(cards.getValue());
	Debug.emit(this.debug, 'Dealer hits.');
	Debug.emit(this.debug, 'Dealer gets ' + card);
	return new Card(Card.getImageData(card), this.pos, 10);
};

/**
 * Dealer stands.
 * @private
*/
Dealer.prototype._stand = function() {
	Debug.emit(this.debug, 'Dealer stands.');
};

/**
 * Dealer shuffles.
 * @public
 * @param {Cards} cards - Game cards to shuffle.
*/
Dealer.prototype.shuffle = function(cards) {
	if(cards.getPlayed() == 0 || cards.getPlayed() >= 45) {
		Debug.emit(this.debug, '-------------------------------------------------------');
		Debug.emit(this.debug, 'Dealer is shuffling cards...');
		Debug.emit(this.debug, '-------------------------------------------------------');
		return cards.shuffle();
	}
};

/**
 * Dealer deals.
 * @public
 * @param {Cards} cards - Game cards.
 * @returns {string[]} Player's cards.
*/
Dealer.prototype.deal = function(cards) {
	var dealt = [];
	var i = 1;
	Debug.emit(this.debug, '-------------------------------------------------------');
	Debug.emit(this.debug, 'Dealer is dealing cards for a new game...');
	Debug.emit(this.debug, '-------------------------------------------------------');
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
	Debug.emit(this.debug, '\nDealer has:');
	Debug.emit(this.debug, '[**]' + this.cards[1]);
	return [dealt[2], dealt[3]];
};

/**
 * Determine if dealer has Blackjack.
 * @public
 * @returns {boolean} Does dealer have Blackjack?
*/
Dealer.prototype.hasBlackjack = function() {
	var blackjack = false;
	if(this.calcTotal() == 21) {
		Debug.emit(this.debug, 'Dealer has Blackjack!');
		blackjack = true;
	}
	return blackjack;
};

/**
 * Determine if dealer is bust.
 * @public
 * @returns {boolean} Is dealer bust?
*/
Dealer.prototype.isBust = function() {
	var bust = false;
	if(this.calcTotal() > 21) {
		Debug.emit(this.debug, 'Dealer is bust!');
		bust = true;
	}
	return bust;
};

/**
 * Dealer responds to player action (e.g. a hit or stand).
 * @public
 * @param {Cards} cards - Game cards.
 * @returns {Card[]} Cards returned.
*/
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

/**
 * Show dealer's cards.
 * @public
 * @returns {number} Total value of dealer's cards.
*/
Dealer.prototype.showCards = function() {
	this.index = 0;
	this.pos = 225;
	var cards = '';
	for(var i = 0; i < this.cards.length; i++) {
		cards += this.cards[i];
	}
	Debug.emit(this.debug, '\nDealer has:');
	Debug.emit(this.debug, cards + ' --> ' + this.calcTotal().toString());
	return this.calcTotal();
};

/**
 * Dealer receives cards.
 * @public
 * @returns {Card[]} Dealer's received cards.
*/
Dealer.prototype.receiveCards = function() {
	this.index++;
	var cardA = new Card(Card.getImageData('c'), this.pos, 10);
	this.index++;
	this.pos += 90;
	var cardB = new Card(Card.getImageData(this.cards[1]), this.pos, 10);
	return [cardA, cardB];
};

/**
 * Dealer reveals first card.
 * @public
 * @returns {Card} Revealed first card.
*/
Dealer.prototype.revealFirstCard = function() {
	return new Card(Card.getImageData(this.cards[0]), 225, 10);
};
