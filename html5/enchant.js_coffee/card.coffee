#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/enchant.js CoffeeScript implementation

class Card 

	# Card represents a single playing card.
	# @param [String] card File path for card graphic
	# @param [Number] posX X position for card
	# @param [Number] posY Y position for card
	# @param [Core] game Enchant.js game object
	constructor: (card, posX, posY, game) ->
		@sprite = new Sprite(71, 96)
		@sprite.image = game.assets[card]
		@sprite.x = posX
		@sprite.y = posY
		@src = card
		
	# Get an image path from card string pattern.
	# @param [String] card String representation for card
	# @return [String] Path to card graphic
	@getImage: (card) ->
		if card == "c" or card == "d"
			return "graphics/#{card}.png"
	
		suit = ""
		if /(h)/.test(card)
			suit = "h"
		else if /(d)/.test(card)
			suit = "d"
		else if /(c)/.test(card)
			suit = "c"
		else if /(s)/.test(card)
			suit = "s"
	
		rank = card.match(/\[*([0-9A-Z]*)\]*/)[1]
		return "graphics/#{suit}#{rank}.png"

	# Get source for image.
	# @return [String] Image source
	getImageSrc: () ->
		return @src

	# Set X, Y position for card.
	# @param [Number] posX X position for card
	# @param [Number] posY Y position for card
	setXY: (posX, posY) ->
		@sprite.x = posX
		@sprite.y = posY

	# Get X, Y position of card.
	# @return [Array<Number>] X, Y position of card
	getXY: () ->
		return [@sprite.x, @sprite.y]

	# Draw the card.
	draw: () ->
		return @sprite
