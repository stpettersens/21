#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Screentip

	constructor: (debug, x, y) ->
		@debug = debug
		@x = x
		@y = y
		@title = ""
		@msg = ""
		Debug.emit(@debug, "Created screentip at #{@x},#{@y}") # !

	emit: (title, message) ->
		@.clear()
		@title = title
		@msg = message

	clear: () ->
		@title = ""
		@msg = ""

	draw: () ->
		if @msg == null 
			@msg = ""
		if @title == null
			@title = ""

		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.font = "10pt Verdana"
		context.fillStyle = "white"
		context.fillText(@title, @x, @y)
		context.fillText(@msg, (@x - 45), (@y + 20))
