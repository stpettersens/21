#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Screentip

	# Screentip implements a title and message box.
	# @param [Boolean] debug Enable debug messages?
	# @param [Number] posX X position for screentip
	# @param [Number] posY Y position for screentip
	constructor: (debug, posX, posY) ->
		@debug = debug
		@posX = posX
		@posY = posY
		@title = ""
		@msg = ""
		Debug.emit(@debug, "Created screentip at #{posX},#{posY}") # !

	# Emit a title and message.
	# @param [String] title Title to emit
	# @param [String] message Message to emit
	emit: (title, message) ->
		@.clear()
		@title = title
		@msg = message

	# Clear the screentip.
	clear: () ->
		@title = ""
		@msg = ""

	# Draw the screentip.
	draw: () ->
		if @msg == null 
			@msg = ""
		if @title == null
			@title = ""

		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.font = "10pt Verdana"
		context.fillStyle = "white"
		context.fillText(@title, @posX, @posY)
		context.fillText(@msg, (@posX - 45), (@posY + 20))
