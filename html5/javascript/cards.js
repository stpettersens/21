/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/JavaScript implementation
*/

function Cards() {
	this.index = -1;
	this.deck_num = 52;
	this.deck = [];
	this.played = [];
	/*this.sorted_hearts = [];
	this.sorted_diamonds = [];
	this.sorted_clubs = [];
	this.sorted_spades = [];*/

	this.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
	this.suits = ['h', 'd', 'c', 's'];
}

Cards.prototype._getRank = function() {
	var i = Math.floor(Math.random() * this.ranks.length);
	return this.ranks[i];
};

Cards.prototype._getSuit = function() {
	var i = Math.floor(Math.random() * this.suits.length);
	return this.suits[i];
};

Cards.prototype._getCard = function() {
	return this._getRank() + ' ' + this._getSuit();
};

Cards.prototype.shuffle = function() {
	this.index = -1;
	this.deck = [];
	this.played = [];
	while(true) {
		var card = this._getCard();
		if(this.deck.indexOf(card) == -1) {
			this.deck.push(card);
			if(this.deck.length == this.deck_num) {
				break;
			}
		}
	}
};

/*Cards.prototype.sort = function() {
	this.sorted_hearts = [];
	this.sorted_diamonds = [];
	this.sorted_clubs = [];
	this.sorted_spades = [];
	for(var i = 0; i < this.deck.length; i++) {
		var rs = this.deck[i].split(' ');
		var num = 0
		if(rs[0] == 'A') num = 1;		 // Ace
		else if(rs[0] == 'J') num = 11;	 // Jack
		else if(rs[0] == 'Q') num = 12;	 // Queen
		else if(rs[0] == 'K') num = 13; // King
		else num = parseInt(rs[0]); 		 // 2 to 10

		if(rs[1] == 'h') {
			if(this.sorted_hearts.indexOf(num) == -1) {
				this.sorted_hearts.push(num);
			}
		}
		else if(rs[1] == 'd') {
			if(this.sorted_diamonds.indexOf(num) == -1) {
				this.sorted_diamonds.push(num);
			}
		}
		else if(rs[1] == 'c') {
			if(this.sorted_clubs.indexOf(num) == -1) {
				this.sorted_clubs.push(num);
			}
		}
		else if(rs[1] == 's') {
			if(this.sorted_spades.indexOf(num) == -1) {
				this.sorted_spades.push(num);
			}
		}
	}

	// Sorted processed cards, lowest to highest.
	this.sorted_hearts.sort(function(a, b) { return a - b });
	this.sorted_diamonds.sort(function(a, b) { return a - b });
	this.sorted_clubs.sort(function(a, b) { return a - b });
	this.sorted_spades.sort(function(a, b) { return a - b });

	var hearts = '';
	for(var i = 0; i < this.sorted_hearts.length; i++) {
		var heart = this.sorted_hearts[i];
		if(heart == 1) heart = 'A';
		else if(heart == 11) heart = 'J';
		else if(heart == 12) heart = 'Q';
		else if(heart == 13) heart = 'K';
		hearts += '[' + heart + 'h]';
	}
	var diamonds = '';
	for(var i = 0; i < this.sorted_diamonds.length; i++) {
		var diamond = this.sorted_diamonds[i];
		if(diamond == 1) diamond = 'A';
		else if(diamond == 11) diamond = 'J';
		else if(diamond == 12) diamond = 'Q';
		else if(diamond == 13) diamond = 'K';
		diamonds += '[' + diamond + 'd]';
	}
	var clubs = '';
	for(var i = 0; i < this.sorted_clubs.length; i++) {
		var club = this.sorted_clubs[i];
		if(club == 1) club = 'A';
		else if(club == 11) club = 'J';
		else if(club == 12) club = 'Q';
		else if(club == 13) club = 'K';
		clubs += '[' + club + 'c]';
	}
	var spades = '';
	for(var i = 0; i < this.sorted_spades.length; i++) {
		var spade = this.sorted_spades[i];
		if(spade == 1) spade = 'A';
		else if(spade == 11) spade = 'J';
		else if(spade == 12) spade = 'Q';
		else if(spade == 13) spade = 'K';
		spades += '[' + spade + 's]';
	}
	return 'Sorted cards:\nH ' + hearts + '\nD ' + diamonds + '\nC ' + clubs + '\nS ' + spades;
};*/

Cards.prototype.draw = function() {
	if(this.played.length == this.deck_num || this.index == -1) {
		this.index = 0;	
	}
	this.played.push(this.deck[this.index]);
	var rs = this.deck[this.index].split(' ');
	return '[' + rs[0] + rs[1] + ']';
};

Cards.prototype.getValue = function() {
	var rs = this.deck[this.index].split(' ');
	this.index++;
	var value = 0;
	if(rs[0] == 'A') value = 1;
	else if(rs[0] == 'J' || rs[0] == 'Q' || rs[0] == 'K') value = 10;
	else value = parseInt(rs[0]);
	return value;
};

Cards.prototype.getPlayed = function() {
	return this.played.length;
};

Cards.prototype.drawAll = function() {
	this.index = 0
	var draws = [];
	for(var i = 0; i < this.deck_num; i++) {
		var d = this.draw();
		draws.push(d);
		this.index++;
	}
	this.index = -1;
	return draws;
};
