# Blackjack
# Copyright 2015 Sam Saint-Pettersen
# Released under the MIT/X11 License.
#	
# HTML5/CoffeeScript implementation

# Coffee-stir includes; 
# invoke "coffee-stir main.coffee -o blackjack.coffee"

#include cards.coffee
#include card.coffee
#include player.coffee
#include dealer.coffee
#include ai.coffee
#include screentip.coffee
#include score.coffee
#include debug.coffee

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

# Main function.
@init = () ->
	Debug.emit(debug, "Initialized HTML5 Blackjack (CoffeeScript build).");
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

# Is the game running on a touch screen device?
# @return [Boolean] Is touch screen device?
@isTouchScreenDevice = () ->
	touch = false
	ua = navigator.userAgent;
	if ua.indexOf("Mobile") != -1 or ua.indexOf("Tablet") != -1
		touch = true
	return touch

# Show cards at end of game.
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

	Debug.emit(debug, "Cards played #{cards.getPlayed()}")
	d_score.emit(dealer.calcTotal())
	if not isTouchScreenDevice() 
		instruction.emit("Play again? Yes [Y key or LMB] or No [N key or Escape key].")
	else
		instruction.emit("Play again? Long tap screen to continue.")

	draw()

# Start a new game.
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

# Update logic.
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

# Draw logic.
@draw = () ->
	clear()
	dealer_pile.draw()
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

# Determine if a Blackjack has occurred.
# @return [Boolean] Has a Blackjack occurred?
@hasBlackjack = () ->
	blackjack = false
	if player.hasBlackjack() or dealer.hasBlackjack()
		blackjack = true
	return blackjack

# Determine if a bust has occurred.
# @return [Boolean] Has a bust occurred?
@isBust = () ->
	bust = false
	if player.isBust() or dealer.isBust()
		bust = true
	return bust

# Take a hit.
@hit = () ->
	if player_index < 6
		player_cards[player_index] = player.hit(cards)
		player_index++
		update()

	draw()

# Take a stand
@stand = () ->
	player.stand()
	received = dealer.respond(cards)
	i = 0
	while i < received.length
		xy = dealer_cards[dealer_index].getXY()
		dealer_cards[dealer_index] = received[i]
		dealer_cards[dealer_index].setXY(xy[0], xy[1])
		Debug.emit(debug, "Added image at #{xy[0]},#{xy[1]}")
		Debug.emit(debug, dealer_index)
		dealer_index++
		i++

	showCards()

# Clear the table.
@clear = () ->
	context = canvas.getContext("2d")
	context.clearRect(0, 0, canvas.width, canvas.height)

# Exit to project's repository on GitHub.
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
