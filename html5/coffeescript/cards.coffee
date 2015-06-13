#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Cards 

	constructor: () ->
		@index = -1
		@deck_num = 52
		@deck = []
		@played = []
		@ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ]
		@suits = [ "h", "d", "c", "s" ]

	_getRank: () ->
		i = Math.floor(Math.random() * @ranks.length)
		return @ranks[i]

	_getSuit: () ->
		i = Math.floor(Math.random() * @suits.length)
		return @suits[i]

	_getCard: () ->
		return "#{@._getRank()} #{@._getSuit()}"

	shuffle: () ->
		@index = -1
		@deck = []
		@played = []
		while true 
			card = @_getCard()
			if @deck.indexOf(card) == -1
				@deck.push(card)
				if @deck.length == @deck_num
					break

	draw: () ->
		if @played.length == @deck_num or @index == -1
			@index = 0

		@played.push(@deck[@index])
		rs = @deck[@index].split(" ")
		return "[#{rs[0]}#{rs[1]}]"

	getValue: () ->
		rs = @deck[@index].split(" ")
		@index++
		value = 0
		if rs[0] == "A"
			value = 1
		else if rs[0] == "J" or rs[0] == "Q" or rs[0] == "K"
			value = 10
		else
			value = parseInt(rs[0])

		return value

	getPlayed: () ->
		return @played.length

	drawAll: () ->
		@index = 0
		draws = []
		i = 0
		while i < @deck_num
			draws.push(@.draw())
			@index++
			i++

		@index = -1
		return draws
