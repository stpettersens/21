#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Cards 

	# Card implements a collection of playing cards
	# and methods to draw and shuffle.
	#
	constructor: () ->
		@index = -1
		@deck_num = 52
		@deck = []
		@played = []
		@ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ]
		@suits = [ "h", "d", "c", "s" ]

	# Get a rank for a card.
	#
	# @return [String] Card rank
	#
	_getRank: () ->
		i = Math.floor(Math.random() * @ranks.length)
		return @ranks[i]

	# Get a suit for a card.
	#
	# @return [String] Card suit
	#
	_getSuit: () ->
		i = Math.floor(Math.random() * @suits.length)
		return @suits[i]

	# Get a card.
	#
	# @return [String] Card as string
	#
	_getCard: () ->
		return "#{@._getRank()} #{@._getSuit()}"

	# Shuffle cards.
	#
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

	# Draw a card.
	#
	# @return [String] Drawn card as string
	#
	draw: () ->
		if @played.length == @deck_num or @index == -1
			@index = 0

		@played.push(@deck[@index])
		rs = @deck[@index].split(" ")
		return "[#{rs[0]}#{rs[1]}]"

	# Get a card's value.
	#
	# @return [Number] Card's value
	#
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

	# Get number of played cards.
	#
	# @return [Number] Number of cards played
	#
	getPlayed: () ->
		return @played.length

	# Draw all the cards from the deck.
	#
	# @return [Array<String>] All cards from deck
	#
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
