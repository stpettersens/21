#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/enchant.js CoffeeScript implementation

class Screentip

	# Screentip implements a title and message box.
	# @param [Boolean] debug Enable debug messages?
	# @param [Number] posX X position for screentip
	# @param [Number] posY Y position for screentip
	constructor: (debug, posX, posY) ->
		@title = new Label('')
		@title.color = 'rgb(255, 255, 255)'
		@title.font = '10pt verdana, sans-serif'
		@title.x = posX
		@title.y = posY
		@msg = @title
		@msg.x = posX - 45
		@msg.y = posY + 20

		Debug.emit(debug, "Created screentip at #{posX},#{posY}") # !

	# Emit a title and message.
	# @param [String] title Title to emit
	# @param [String] message Message to emit
	emit: (title, message) ->
		@.clear()
		@title.text = title
		@msg.text = message

	# Clear the screentip.
	clear: () ->
		@title.text = ""
		@msg.text = ""

	# Draw the screentip.
	# @return [Array<Label>] The screentip
	draw: () ->
		if @msg.text == null 
			@msg.text = ""
		if @title.text == null
			@title.text = ""

		return [@title, @msg]
