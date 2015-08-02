#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Player

	# Player implements the player for Blackjack.
	# @param [Boolean] debug Enable debug messages?
	constructor: (debug) ->
		@debug = debug
		@index = -1
		@pos = 225
		@cards = []
		@values = []

	# Calculate the total value of player's held cards.
	# @return [Number] Total value for player's cards
	calcTotal: () ->
		@values.sort((a, b) ->  return b - a)
		total = 0
		i = 0
		while i < @values.length
			v = @values[i]
			if v == 1
				if (total + 11) <= 21
					v = 11
				if (total + 11) > 21
					v = 1

			total += v
			i++
		return total

	# Determine if player has Blackjack.
	# @return [Boolean] Does player have Blackjack?
	hasBlackjack: () ->
		blackjack = false
		if @.calcTotal() == 21
			Debug.emit(@debug, "Dealer has Blackjack!")
			blackjack = true
		return blackjack

	# Determine if player is bust.
	# @return [Boolean] Is player bust?
	isBust: () ->
		bust = false
		if @.calcTotal() > 21
			Debug.emit(@debug, "Dealer is bust!")
			bust = true
		return bust

	# Receive cards from dealer.
	# @param [Array<String>] player_cards Player's cards as Array<String>
	# @return [Array<Card>] Player's cards as Array<Card>
	receiveCards: (player_cards) ->
		pc = ""
		i = 0
		while i < player_cards.length
			cv = player_cards[i].split(":")
			@cards.push(cv[0])
			@values.push(parseInt(cv[1]))
			i++

		pc = @cards[0] + @cards[1]
		Debug.emit(@debug, "\nPlayer receives their cards:")
		Debug.emit(@debug, "#{pc} --> #{@.calcTotal()}")
		@index++
		cardA = new Card(Card.getImageData(@cards[@index]), @pos, 310)
		@pos += 90
		@index++
		cardB = new Card(Card.getImageData(@cards[@index]), @pos, 310)
		return [cardA, cardB]

	# Player hits.
	# @param [Cards] cards Game cards
	# @return [Card] Player's drawn card
	hit: (cards) ->
		card = cards.draw()
		@cards.push(card)
		@values.push(cards.getValue())
		@index++
		@pos += 90
		Debug.emit(@debug, "Player hits.")
		Debug.emit(@debug, "Player gets #{card}")
		Debug.emit(@debug, "Player has #{@.calcTotal()}")
		return new Card(Card.getImageData(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), @pos, 310)

	# Player stands.
	stand: () ->
		Debug.emit(@debug, "Player stands.")
		Debug.emit(@debug, "Player has #{@.calcTotal()}")

	# Show player's cards.
	# @return [Number] Total value of player's cards
	showCards: () ->
		@index = 0
		@pos = 225
		i = 0
		while i < @cards.length
			cards = @cards[i]
			i++

		Debug.emit(@debug, "\nPlayer has:")
		Debug.emit(@debug, "#{cards} --> #{@.calcTotal()}")
		return @.calcTotal()
