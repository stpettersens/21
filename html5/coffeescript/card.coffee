#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Card 

	# Card represents a single playing card.
	#
	# @param [String] card Data URI for card graphic
	# @param [Number] posX X position for card
	# @param [Number] posY Y position for card
	#
	constructor: (card, posX, posY) ->
		@image = new Image()
		@image.src = card
		@posX = posX		
		@posY = posY
		
	# Get an image path from card string pattern.
	#
	# @param [String] card String representation for card
	# @return [String] Path to card graphic
	#
	@getImage: (card) ->
		if card == "c" or card == "d"
			return "gfx/#{card}.png"
	
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
		return "gfx/" + suit + rank + ".png"
	
	# Get an image data URI from card string pattern.
	#
	# @param [String] card String represenation for card
	# @return [String] Data URI for card graphic
	#
	@getImageData: (card) ->
		return graphics[gfx_fns.indexOf(Card.getImage(card))]

	# Get source for image.
	#
	# @return [String] Image source
	#
	getImageSrc: () ->
		return @image.src

	# Set X, Y position for card.
	#
	# @param [Number] posX X position for card
	# @param [Number] posY Y position for card
	#
	setXY: (posX, posY) ->
		@posX = posX
		@posY = posY

	# Get X, Y position of card.
	#
	# @return [Array<Number>] X, Y position of card
	#
	getXY: () ->
		return [@posX, @posY]

	# Draw the card.
	#
	draw: () ->
		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.drawImage(@image, @posX, @posY, @image.width, @image.height)
