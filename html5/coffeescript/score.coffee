#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Score

	# Score implements a score or information box.
	#
	# @param [Boolean] debug Enable debug messages?
	# @param [Number] posX X position for score box
	# @param [Number] posY Y position for score box
	#
	constructor: (debug, posX, posY) ->
		@debug = debug
		@posX = posX
		@posY = posY
		@score = ""
		Debug.emit(@debug, "Created score counter at #{posX},#{posY}") # !

	# Emit a score or similar message.
	#
	# @param [Any] score Score or similar message to emit
	#
	emit: (score) ->
		@.clear()
		@score = score

	# Clear the score box.
	#
	clear: () ->
		@score = ""

	# Draw the score box.
	#
	draw: () ->
		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.font = "10pt Verdana"
		context.fillStyle = "white"
		context.fillText(@score, @posX, @posY)
