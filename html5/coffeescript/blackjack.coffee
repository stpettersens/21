class Debug 

	@print: (debug, message) ->
		if debug
			console.log(message)

#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

debug = false

class Score

	constructor: (debug, x, y) ->
		debug = debug
		@x = x
		@y = y
		@score = ""
		Debug.print(debug, "Created score counter at #{x},#{y}") # !

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

#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

debug = false

class Screentip

	constructor: (debug, x, y) ->
		debug = debug
		@x = x
		@y = y
		@title = ""
		@msg = ""
		Debug.print(debug, "Created screentip at #{x},#{y}") # !

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

#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

debug = false

class Player

	constructor: (debug) ->
		debug = debug
		@index = -1
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

	receiveCards: (player_cards) ->
		pc = ""
		i = 0
		while i < player_cards.length
			cv = player_cards[i].split(":")
			@cards.push(cv[0])
			@values.push(parseInt(cv[1]))
			i++

		pc = @cards[0] + @cards[1]
		Debug.print(debug, "\nPlayer receives their cards:")
		Debug.print(debug, "#{pc} --> #{@.calcTotal()}")
		@index++
		cardA = new Card(Card_getImageData(@cards[@index]), @pos, 310)
		@pos += 90
		@index++
		cardB = new Card(Card_getImageData(@cards[@index]), @pos, 310)
		return [cardA, cardB]

	hit: (cards) ->
		card = cards.draw()
		@cards.push(card)
		@values.push(cards.getValue())
		@index++
		@pos += 90
		Debug.print(debug, "Player hits.");
		Debug.print(debug, "Player gets #{card}");
		Debug.print(debug, "Player has #{@.calcTotal()}");
		return new Card(Card_getImageData(card.match(/\[*([A-Za-z0-9]+)\]*/)[0]), @pos, 310);

	stand: () ->
		Debug.print(debug, "Player stands.")
		Debug.print(debug, "Player has #{@.calcTotal()}")

	showCards: () ->
		@index = 0
		@pos = 225
		i = 0
		while i < @cards.length
			cards = @cards[i]
			i++

		Debug.print(debug, "\nPlayer has:")
		Debug.print(debug, "#{cards} --> #{@.calcTotal()}")
		return @.calcTotal()

#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

#@staticmethod
Card_getImage = (card) ->
	if card == "c" or card == "d"
		return "gfx/#{card}.png"

	suit = ""
	if /(h)/.test(card)
		suit = "h"
	else if /(d)/.test(card)
		suit = "d"
	else if /(c)/.test(card)
		suit = "c"
	else if /(s)/.test(card)
		suit = "s"

	rank = card.match(/\[*([0-9A-Z]*)\]*/)[1];
	return "gfx/" + suit + rank + ".png";

#@staticmethod
Card_getImageData = (card) ->
	return graphics[gfx_fns.indexOf(Card_getImage(card))]

class Card 

	constructor: (card, pos_x, pos_y) ->
		@image = new Image()
		@image.src = card
		@pos_x = pos_x
		@pos_y = pos_y

	getImage: () ->
		return @image.src

	setXY: (pos_x, pos_y) ->
		@pos_x = pos_x
		@pos_y = pos_y

	getXY: () ->
		return [@pos_x, @pos_y]

	draw: () ->
		canvas = document.getElementById("blackjack-table")
		context = canvas.getContext("2d")
		context.drawImage(@image, @pos_x, @pos_y, @image.width, @image.height)

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

#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
#	HTML5/CoffeeScript implementation

# Coffee-stir includes; 
# invoke "coffee-stir main.coffee -o blackjack.coffee"









debug = true
use_ai = false
playing = true
player_index = 2;
player_cards = []
dealer_index = 2;
dealer_cards = []
screentip = null;
instruction = null
p_score = null;
d_score = null;
dealer_pile = null
cards = null
player = null
dealer = null
canvas = null
timer = 0;

SCREEN_WIDTH = 780
SCREEN_HEIGHT = 500

@init = () ->
	Debug.print(debug, "Initialized HTML5 Blackjack (CoffeeScript build).");
	canvas = document.getElementById("blackjack-table")
	canvas.width = "#{SCREEN_WIDTH}"
	canvas.height = "#{SCREEN_HEIGHT}"
	canvas.style.backgroundColor = "rgb(0, 153, 0)"
	canvas.style.marginLeft = "auto"
	canvas.style.marginRight = "auto"
	canvas.style.display = "block"
	canvas.style.border = "1px dotted rgb(0, 0, 0)"

	screentip = new Screentip(debug, ((SCREEN_WIDTH / 2) - 50), 190)
	instruction = new Score(debug, ((SCREEN_WIDTH / 2) - 155), 450)
	p_score = new Score(debug, 153, 315)
	d_score = new Score(debug, 153, 25)
	cards = new Cards()
	newGame()

@isTouchScreenDevice = () ->
	isTouch = false
	ua = navigator.userAgent;
	if ua.indexOf("Mobile") != -1 or ua.indexOf("Tablet") != -1
		isTouch = true
	return isTouch

@showCards = () ->
	playing = false
	dealer_cards[0] = dealer.revealFirstCard()
	ds = dealer.showCards()
	ps = player.showCards()

	if ps == 21 and player_index == 2 and ds != 21
		screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!")

	else if ds == 21 and dealer_index == 2 and ps != 21
		screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!")

	else if (ps == ds) or (ps > 21 and ds > 21)
		screentip.emit("PUSH", "Neither dealer nor player won.")

	else if ps <= 21 and ps > ds
		screentip.emit("PLAYER WINS", "Player wins with #{ps}. Well done.")

	else if ds <= 21 and ds > ps
		screentip.emit("DEALER WINS", "Dealer wins with #{ds}. Too bad.")

	else if ps > 21 and ds <= 21
		screentip.emit("DEALER WINS", "Dealer wins. Player bust.")

	else if ds > 21 and ps <= 21
		screentip.emit("PLAYER WINS", "Player wins. Dealer bust.")

	if cards.getPlayed() == 52
		dealer_pile = new Card(Card_getImage("d"), 10, 10)

	Debug.print(debug, "Cards played #{cards.getPlayed()}")
	d_score.emit(dealer.calcTotal())
	if not isTouchScreenDevice() 
		instruction.emit("Play again? Yes [Y key or LMB] or No [N key or Escape key].")
	else
		instruction.emit("Play again? Long tap screen to continue.")

	draw()

@newGame = () ->
	clear()
	playing = true
	player_index = 2
	player_cards = []
	dealer_index = 2;
	dealer_cards = []
	dealer_pile = new Card(Card_getImageData("c"), 10, 10)
	screentip.clear();
	player = new Player(debug)
	dealer = new Dealer(debug)
	dealer.shuffle(cards);
	player_cards = player.receiveCards(dealer.deal(cards))
	dealer_cards = dealer.receiveCards()
	player_cards[2] = new Card(Card_getImageData("d"), 405, 310);
	player_cards[3] = new Card(Card_getImageData("d"), 495, 310);
	player_cards[4] = new Card(Card_getImageData("d"), 585, 310);
	dealer_cards[2] = new Card(Card_getImageData("d"), 405, 10);
	dealer_cards[3] = new Card(Card_getImageData("d"), 495, 10);
	dealer_cards[4] = new Card(Card_getImageData("d"), 585, 10);
	update()
	draw()

@update = () ->
	if hasBlackjack() or isBust()
		showCards()

	p_score.emit(player.calcTotal())

	if playing
		d_score.emit("?")
		if not isTouchScreenDevice()
			instruction.emit("Hit [H key or LMB] or Stand [S key or RMB]?")
		else
			instruction.emit("Hit [Short tap] or Stand [Long tap]?")

@draw = () ->
	clear()
	screentip.draw()
	instruction.draw()
	p_score.draw()
	d_score.draw()
	i = 0
	while i < player_cards.length
		player_cards[i].draw()
		i++
	i = 0
	while i < dealer_cards.length
		dealer_cards[i].draw()
		i++

@hasBlackjack = () ->
	blackjack = false
	if player.hasBlackjack() or dealer.hasBlackjack()
		blackjack = true
	return blackjack

@isBust = () ->
	bust = false
	if player.isBust() or dealer.isBust()
		bust = true
	return bust

@hit = () ->
	if player_index < 6
		player_cards[player_index] = player.hit(cards)
		player_index++
		update()

	draw()

@stand = () ->
	player.stand()
	received = dealer.respond(cards)
	i = 0
	while i < received.length
		xy = dealer_cards[dealer_index].getXY()
		dealer_cards[dealer_index] = received[i]
		dealer_cards[dealer_index].setXY(xy[0], xy[1])
		Debug.print(debug, "Added image at #{xy[0]},#{xy[1]}")
		Debug.print(debug, dealer_index)
		dealer_index++
		i++

	showCards()

@clear = () ->
	context = canvas.getContext("2d")
	context.clearRect(0, 0, canvas.width, canvas.height)

@exitToGithub = () ->
	window.location.href = "https:github.com/stpettersens/21"

# Touch controls.
start = null
document.addEventListener "touchstart", (event) ->
	event.preventDefault()
	start = new Date().getTime()

document.addEventListener "touchend", (event) ->
	event.preventDefault()
	elapsed = new Date().getTime() - start
	if elapsed < 600 and elapsed > 0
		if playing
			hit()
	else
		if playing
			stand()
		else
			newGame()

# Mouse controls.
document.addEventListener "mousedown", (event) ->
	if playing and event.which == 1 # Left click for hit.
		hit()
	else if playing and event.which == 3 # Right click for stand.
		stand()
	else if not playing and event.which == 1 # Left click for yes, another game.
		newGame()

# ... Prevent context menu show up on right click.
document.addEventListener "contextmenu", (event) ->
	event.preventDefault()

# Keyboard controls.
document.addEventListener "keydown", (event) ->
	if playing and event.keyCode == 72 # H for hit.
		hit()
	else if playing and event.keyCode == 83 # S for stand.
		stand()
	else if not playing and event.keyCode == 89 # Y for yes, another game.
		newGame()
	else if not playing and event.keyCode == 78 # N for no and exit.
		exitToGithub()
	else if event.keyCode == 27 # Escape key always exits.
		exitToGithub()

