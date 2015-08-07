#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

class Dealer 

	# Dealer implements the dealer for Blackjack.
	# @param [Boolean] debug Enable debug messages?
	constructor: (debug) ->
		@debug = debug
		@index = 0
		@pos = 225
		@cards = []
		@values = []

	# Calculate the total value of dealer's held cards.
	# @return [Number] Total value of dealer's cards
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

	# Dealer hits.
	# @param [Cards] cards Game cards
	# @return [Card] Dealer's drawn card
	_hit: (cards) ->
		@index++
		@pos += 90
		card = cards.draw()
		@cards.push(card)
		@values.push(cards.getValue())
		Debug.emit(@debug, "Dealer hits.")
		Debug.emit(@debug, "Dealer gets #{card}")
		return new Card(Card.getImageData(card), @pos, 10)

	# Dealer stands.
	_stand: () ->
		Debug.emit(@debug, "Dealer stands.")

	# Dealer shuffles.
	# @param [Cards] cards Game cards to shuffle
	shuffle: (cards) ->
		if cards.getPlayed() == 0 or cards.getPlayed() >= 45
			SoundEffects.play("shuffle")
			Debug.emit(@debug, "-------------------------------------------------------")
			Debug.emit(@debug, "Dealer is shuffling cards...")
			Debug.emit(@debug, "-------------------------------------------------------")
			cards.shuffle()

	# Dealer deals.
	# @param [Cards] cards Game cards
	# @return [Array<String>] Player's cards
	deal: (cards) ->
		SoundEffects.play("deal")
		dealt = []
		i = 1
		Debug.emit(@debug, "-------------------------------------------------------")
		Debug.emit(@debug, "Dealer is dealing cards for a new game...")
		Debug.emit(@debug, "-------------------------------------------------------")
		while i <= (2 * 2)
			dealt.push("#{cards.draw()}:#{cards.getValue()}")
			i++

		i = 0
		while i < 2
			cv = dealt[i].split(":")
			@cards.push(cv[0])
			@values.push(parseInt(cv[1]))
			i++

		Debug.emit(@debug, "\nDealer has:")
		Debug.emit(@debug, "[**]#{@cards[1]}")
		return [dealt[2], dealt[3]]

	# Determine if dealer has Blackjack.
	# @return [Boolean] Does dealer have Blackjack?
	hasBlackjack: () ->
		blackjack = false
		if @.calcTotal() == 21
			Debug.emit(@debug, "Dealer has Blackjack!")
			blackjack = true
		return blackjack

	# Determine if dealer is bust.
	# @return [Boolean] Is dealer bust?
	isBust: () ->
		bust = false
		if @.calcTotal() > 21
			Debug.emit(@debug, "Dealer is bust!")
			bust = true
		return bust

	# Dealer responds to player action (e.g. a hit or stand).
	# @param [Cards] cards Game cards
	# @return [Array<Card>] Cards returned
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
						response_cards.push(@._hit(cards)) # Take risk.
					else
						@._stand() # Play it safe.

				else if total >= 17
					@._stand()
					responding = false
					break
				else
					response_cards.push(@._hit(cards))

		return response_cards

	# Show dealer's cards.
	# @return [Number] Total value of dealer's cards
	showCards: () ->
		@index = 0
		@pos = 225
		cards = ""
		i = 0
		while i < @cards.length
			cards += @cards[i]
			i++

		Debug.emit(@debug, "\nDealer has:")
		Debug.emit(@debug, "#{cards} --> #{@.calcTotal()}")
		return @.calcTotal()

	# Dealer receives cards.
	# @return [Array<Card>] Dealer's received cards
	receiveCards: () ->
		cardA = new Card(Card.getImageData("c"), @pos, 10)
		@pos += 90
		cardB = new Card(Card.getImageData(@cards[1]), @pos, 10)
		@index += 2
		return [cardA, cardB]

	# Dealer reveals first card.
	# @return [Card] Revealed first card
	revealFirstCard: () ->
		SoundEffects.play("reveal")
		return new Card(Card.getImageData(@cards[0]), 225, 10)
