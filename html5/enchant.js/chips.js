/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Chips class for Blackjack.
 * @copyright 2015 Sam Saint-Pettersen
*/

/**
 * Chip represents a collection of betting chips.
 * @constructor
*/
function Chips() {
	this.deckWhite = 0;
	this.deckRed = 0;
	this.deckBlue = 0;
	this.deckGreen = 0;
	this.deckBlack = 0;
	this.values = [ 1, 5, 10, 25, 100 ];
}

/**
 * Get chip currency value from color.
 * @param {string} Color of the chip.
 * @returns {number} Chip value.
*/
Chips.prototype.getChip = function(color) {
	var value = 0;
	switch(color) {
		case 'WHITE':
			value = values[0];
			break;
		case 'RED':
			value = values[1];
			break;
		case 'BLUE':
			value = values[2];
			break;
		case 'GREEN':
			value = values[3];
			break;
		case 'BLACK':
			value = values[4];
			break;
	}
	return value;
}

/**
 * Deal chips for a given betting balance.
 * @param [number] balance Currency amount available to bet.
*/
Chips.prototype.deal = function(balance) {
	deckWhite = 0;
	deckRed = 0;
	deckBlue = 0;
	deckGreen = 0;
	deckBlack = 0;
	// Deal out white chips.
	for(var i = 0; i < Math.floor(balance / values[0]); i++)
		deckWhite++;
	// Deal out red chips.
	for(var i = 0; i < Math.floor(balance / values[1]); i++)
		deckRed++;
	// Deal out blue chips.
	for(var i = 0; i < Math.floor(balance / values[2]); i++)
		deckBlue++;
	// Deal out green chips.
	for(var i = 0; i < Math.floor(balance / values[3]); i++)
		deckGreen++;
	// Deal out black chips.
	for(var i = 0; i < Math.floor(balance / values[4]); i++)
		deckBlack++;
}

/**
 * Draw a chip.
 * @param {string} color Color of chosen chip.
 * @param {number} balance Currency amount available to bet.
 * @return {string/number[]} Chosen color, new balance.
*/
Cards.prototype.draw = function(color, balance) {
	if(balance > 0) {
		var bet = 0;
		if(color == 'WHITE' && balance >= values[0])
			bet = getChip('WHITE');
		else if(color == 'RED' && balance >= values[1])
			bet = getChip('RED');
		else if(color == 'BLUE' && balance >= values[2])
			bet = getChip('BLUE');
		else if(color == 'GREEN' && balance >= values[3])
			bet = getChip('GREEN');
		else if(color == 'BLACK' && balance >= values[4])
			bet = getChip('BLACK');

		balance -= bet;
		return [ color, balance ];
	}
	return [ null, 0 ];
}

/**
 * Get values for chips.
 * @returns {number[]} Values for each color chip.
*/
Chips.prototype.getValues = function() {
	return values;
}

/**
 * Get number of available chips.
 * @returns {number[]} Numbers of each color chip.
*/
Chips.prototype.getNums = function() {
	return [ deckWhite, deckRed, deckBlue, deckGreen, deckBlack ];
}
