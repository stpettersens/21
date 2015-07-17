#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Score

	constructor: (debug, x, y) ->
		@debug = debug
		@x = x
		@y = y
		@score = ""
		Debug.emit(@debug, "Created score counter at #{@x},#{@y}") # !

	emit: (score) ->
		@.clear()
		@score = score

	clear: () ->
		@score = ""

	draw: () ->
		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.font = "10pt Verdana"
		context.fillStyle = "white"
		context.fillText(@score, @x, @y)
