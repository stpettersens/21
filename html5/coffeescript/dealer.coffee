#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

debug = false

class Dealer 

	constructor: (debug) ->
		debug = debug
		@index = 0
		@pos = 225
		@cards = []
		@values = []

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

	_hit: (cards) ->
		@index++
		@pos += 90
		card = cards.draw()
		@cards.push(card)
		@values.push(cards.getValue())
		Debug.print(debug, "Dealer hits.")
		Debug.print(debug, "Dealer gets #{card}")
		return new Card(Card_getImageData(card), @pos, 10)

	_stand: () ->
		Debug.print(debug, "Dealer stands.")

	shuffle: (cards) ->
		if cards.getPlayed() == 0 or cards.getPlayed() >= 45
			Debug.print(debug, "-------------------------------------------------------");
			Debug.print(debug, "Dealer is shuffling cards...");
			Debug.print(debug, "-------------------------------------------------------");
			cards.shuffle()

	deal: (cards) ->
		dealt = []
		i = 1
		Debug.print(debug, "-------------------------------------------------------");
		Debug.print(debug, "Dealer is dealing cards for a new game...");
		Debug.print(debug, "-------------------------------------------------------");
		while i <= (2 * 2)
			dealt.push("#{cards.draw()}:#{cards.getValue()}")
			i++

		i = 0
		while i < 2
			cv = dealt[i].split(":")
			@cards.push(cv[0])
			@values.push(parseInt(cv[1]))
			i++

		Debug.print(debug, "\nDealer has:")
		Debug.print(debug, "[**]#{@cards[1]}")
		return [dealt[2], dealt[3]]

	hasBlackjack: () ->
		blackjack = false
		if @.calcTotal() == 21
			Debug.print(debug, "Dealer has Blackjack!")
			blackjack = true
		return blackjack

	isBust: () ->
		bust = false
		if @.calcTotal() > 21
			Debug.print(debug, "Dealer is bust!")
			bust = true
		return bust

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

	showCards: () ->
		@index = 0
		@pos = 225
		cards = ""
		i = 0
		while i < @cards.length
			cards += @cards[i]
			i++

		Debug.print(debug, "\nDealer has:")
		Debug.print(debug, "#{cards} --> #{@.calcTotal()}")
		return @.calcTotal()

	receiveCards: () ->
		cardA = new Card(Card_getImageData("c"), @pos, 10)
		@pos += 90
		cardB = new Card(Card_getImageData(@cards[1]), @pos, 10)
		@index += 2
		return [cardA, cardB]

	revealFirstCard: () ->
		return new Card(Card_getImageData(@cards[0]), 225, 10)
