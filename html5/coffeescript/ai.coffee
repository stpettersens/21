#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class AI

	# AI implements an artificial player (not the dealer).
	# @param [Boolean] debug Enable debug messages?
	constructor: (debug) ->
		@debug = debug
		@index = 0
		@pos = 255
		@cards = []
		@values = []

	# Calculate the total value of AI's held cards.
	# @return [Number] Total value of AI's cards
	calcTotal: () ->
		@values.sort((a, b) -> return b - a)
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

	# Determine if AI has Blackjack.
	# @return [Boolean] Does AI have Blackjack?
	hasBlackjack: () ->
		blackjack = false
		if @.calcTotal() == 21
			Debug.emit(@debug, "AI has Blackjack!")
			blackjack = true
		return blackjack

	# Determine if AI is bust.
	# @return [Boolean] Is AI bust?
	isBust: () ->
		bust = false
		if @.calcTotal() > 21
			Debug.emit(@debug, "AI is bust!")
			bust = true
		return bust

	# Receive cards from dealer.
	# @param [Array<String>] ai_cards AI's cards as Array<String>
	# @return [Array<Card>] AI's cards as Array<Card>
	receiveCards: (ai_cards) ->
		ac = ""
		i = 0
		while i < ai_cards.length
			cv = ai_cards[i].split(":")
			@cards.push(cv[0])
			@values.push(parseInt(cv[1]))
			i++

		ac = @cards[0] + @cards[1]
		Debug.emit(@debug, "\nAI receives their cards:")
		Debug.emit(@debug, "#{ac} --> #{@.calcTotal()}")
		@index++
		cardA = new Card(Card.getImageData(@cards[@index]), @pos, 310)
		@pos += 90
		@index++
		cardB = new Card(Card.getImageData(@cards[@index]), @pos, 310)
		return [cardA, cardB]

	# AI hits.
	# @param [Cards] cards Game cards
	# @return [Card] AI's drawn card
	_hit: (cards) ->
		card = cards.draw()
		@cards.push(card)
		@values.push(cards.getValue())
		@index++
		@pos += 90
		Debug.emit(@debug, "AI hits.")
		Debug.emit(@debug, "AI gets #{card}")
		Debug.emit(@debug, "AI has #{@.calcTotal()}")
		return new Card(Card.getImageData(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), @pos, 310)

	# AI stands.
	_stand: () ->
		Debug.emit(@debug, "AI stands.")
		Debug.emit(@debug, "AI has #{@.calcTotal()}")

	# AI responds to cards received or dealer.
	# @param [Cards] cards Game cards 
	# @return [Array<Card>] Response cards
	respond: (cards) ->
		@.showCards()
		responding = true
		response_cards = []
		while responding
			total = 0
			while total <= 18
				total = @.calcTotal()
				if total == 16
					if Math.floor(Math.random() * 6) >= 3
						@.index++
						@.pos += 90
						response_cards.push(@._hit(cards)) # Take risk.
					else
						@._stand() # Play it safe.

				else if total >= 17
					@._stand()
					responding = false
					break
				else
					@.index++
					@.pos += 90
					response_cards.push(@._hit(cards))

		return response_cards

	# Show AI's cards.
	# @return [Number] Total value of AI's cards
	showCards: () ->
		@index = 0
		@pos = 225
		cards = ""
		i = 0
		while i < @cards.length
			cards += @cards[i]
			i++

		Debug.emit(@debug, "\nAI has:")
		Debug.emit(@debug, "#{cards} --> #{@.calcTotal()}")
		return @.calcTotal()
