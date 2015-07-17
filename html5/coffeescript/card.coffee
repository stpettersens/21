#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Card 

	constructor: (card, pos_x, pos_y) ->
		@image = new Image()
		@image.src = card
		@pos_x = pos_x
		@pos_y = pos_y
		
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
		
	@getImageData: (card) ->
		return graphics[gfx_fns.indexOf(Card.getImage(card))]

	#getImage: () ->
		#return @image.src

	setXY: (pos_x, pos_y) ->
		@pos_x = pos_x
		@pos_y = pos_y

	getXY: () ->
		return [@pos_x, @pos_y]

	draw: () ->
		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.drawImage(@image, @pos_x, @pos_y, @image.width, @image.height)
