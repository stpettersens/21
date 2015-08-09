#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/enchant.js CoffeeScript implementation

class Score

	# Score implements a score or information box.
	# @param [Boolean] debug Enable debug messages?
	# @param [Number] posX X position for score box
	# @param [Number] posY Y position for score box
	constructor: (debug, posX, posY) ->
		@box = new Label('')
		@box.color = 'rgb(255, 255, 255)'
		@box.font = '10pt verdana, sans-serif'
		@box.x = posX
		@box.y = posY
		@box.width = 500

		Debug.emit(debug, "Created score counter at #{posX},#{posY}") # !

	# Emit a score or similar message.
	# @param [Any] score Score or similar message to emit
	emit: (score) ->
		@.clear()
		@box.text = score.toString()

	# Clear the score box.
	clear: () ->
		@box.text = ""

	# Draw the score box.
	# @return {Label} The score box
	draw: () ->
		return @box
