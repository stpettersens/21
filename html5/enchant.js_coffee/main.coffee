#	Blackjack
#	Copyright 2015 Sam Saint-Pettersen
#	Released under the MIT/X11 License.
#	
# 	HTML5/enchant.js CoffeeScript implementation

debug = false
use_ai = false
sound = true
playing = true
player_index = 2
player_cards = []
dealer_index = 2
dealer_cards = []
screentip = null
instruction = null
p_score = null
d_score = null
dealer_pile = null
cards = null
player = null
dealer = null
canvas = null
toggle_sound = null
timer = 0;
game = null
scene = null

SCREEN_WIDTH = 780
SCREEN_HEIGHT = 500

# Main function.
@init = () ->
	stage = document.getElementById('enchant-stage')
	stage.style.marginLeft = 'auto'
	stage.style.marginRight = 'auto'
	stage.style.boder = '1px dotted rgb(0, 0, 0)'
	enchant()
	game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT)
	content = graphics.concat(sounds)
	Debug.emit(debug, 'Loading assets:')
	Debug.emit(debug, content)
	game.preload(content)
	game.onload = () ->
		scene = new Scene()
		scene.backgroundColor = 'rgb(0, 153, 0)'

		screentip = new Screentip(debug, ((SCREEN_WIDTH / 2) - 60), 190)
		instruction = new Score(debug, ((SCREEN_WIDTH /2) - 200), 450)
		p_score = new Score(debug, 153, 315)
		d_score = new Score(debug, 153, 25)
		cards = new Cards()
		game.sfx = enchantSFXSupported()
		toggle_sound = new Score(debug, 600, 15)
		newGame()

	Debug.emit(debug, 'Initialized HTML5 Blackjack (enchant.js build).')
	game.start()

	# Touch controls.
	start = null
	stage.addEventListener('touchstart', (event) ->
		event.preventDefault()
		start = new Date().getTime()
	)

	stage.addEventListener('touchend', (event) ->
		event.preventDefault()
		elapsed = new Date().getTime() - start
		if (elapsed < 600) and (elapsed > 0)
			if playing
				hit()
			else
				if playing
					stand()
				else
					newGame()
	)

	# Mouse controls.
	stage.addEventListener('mousedown', (event) ->
		if playing and event.which == 1
			hit()

		else if playing and event.which == 3
			stand()

		else if not playing and event.which == 1
			newGame()
	)
	# Prevent context menu show up on right click.
	stage.addEventListener('contextmenu', (event) ->
		event.preventDefault()
	)

	# Keyboard controls.
	stage.addEventListener('keydown', (event) ->
		if playing and event.keyCode == 72
			hit()

		else if playing and event.keyCode == 83
			stand()

		else if not playing and event.keyCode == 89
			newGame()

		else if not playing and event.keyCode == 78
			exitToGitHub()

		else if event.keyCode == 27
			exitToGitHub()

		else if event.keyCode == 69
			toggleSound()
	)

# Is the game running on a touch screen device?
# @return [Boolean] Is touch screen device?
@isTouchScreenDevice = () ->
	touch = false
	ua = navigator.userAgent;
	if ua.indexOf('Mobile') != -1 or ua.indexOf('Tablet') != -1
		touch = true

	return touch

# Toggle sound effects on/off.
@toggleSound = () ->
	sound = SoundEffects.toggle()
	update()

# Does the browser support sound effects via enchant.js?
# @return [Boolean] Are sound effects supported via enchant.js?
enchantSFXSupported = () ->
	effects = true
	ua = navigator.userAgent;
	if ua.indexOf('WebKit') != -1
		effects = false

	return effects

# Show cards at end of game.
@showCards = () ->
	playing = false
	dealer_cards[0] = dealer.revealFirstCard()
	ds = dealer.showCards()
	ps = player.showCards()

	if ps == 21 and player_index == 2 and ds != 21
		screentip.emit('PLAYER BLACKJACK!', 'Player has 21. That\'s a Blackjack!')

	else if ds == 21 and dealer_index == 2 and ps != 21
		screentip.emit('DEALER BLACKJACK!', 'Dealer has 21. That\'s a Blackjack!')

	else if (ps == ds) or (ps > 21 and ds > 21)
		screentip.emit('PUSH', 'Neither dealer nor player won.')

	else if ps <= 21 and ps > ds
		screentip.emit('PLAYER WINS', "Player wins with #{ps}. Well done.")

	else if ds <= 21 and ds > ps
		screentip.emit('DEALER WINS', 'Dealer wins. Player bust.')

	else if ds > 21 and ps <= 21
		screentip.emit('PLAYER WINS', 'Player wins. Dealer bust.')

	if cards.getPlayed() == 52
		dealer_pile = new Card(Card.getImage('d'), 10, 10, game)

	Debug.emit(debug, "Cards played #{cards.getPlayed()}")
	d_score.emit(dealer.calcTotal())
	if(not isTouchScreenDevice())
		instruction.emit('Play again? Yes [Y key or LMB] or No [N key or Escape key].')
	else
		instruction.emit('Play again? Long tap screen to continue.')

	draw()

# Start a new game.
@newGame = () ->
	clear()
	playing = true
	player_index = 2
	player_cards = new Array(5)
	dealer_index = 2
	dealer_cards = new Array(5)
	dealer_pile = new Card(Card.getImage('c'), 10, 10, game)
	screentip.clear()
	player = new Player(debug, game)
	dealer = new Dealer(debug, game)
	dealer.shuffle(cards)
	player_cards = player.receiveCards(dealer.deal(cards))
	dealer_cards = dealer.receiveCards()
	player_cards[2] = new Card(Card.getImage('d'), 405, 310, game)
	player_cards[3] = new Card(Card.getImage('d'), 495, 310, game)
	player_cards[4] = new Card(Card.getImage('d'), 585, 310, game)
	dealer_cards[2] = new Card(Card.getImage('d'), 405, 10, game)
	dealer_cards[3] = new Card(Card.getImage('d'), 495, 10, game)
	dealer_cards[4] = new Card(Card.getImage('d'), 585, 10, game)
	update()
	draw()

# Update logic.
@update = () ->
	if(sound)
		toggle_sound.emit('Turn sound off [E key]')
	else
		toggle_sound.emit('Turn sound on [E key]')

	if hasBlackjack() or isBust()
		showCards()

	p_score.emit(player.calcTotal())

	if playing
		d_score.emit('?')
		instruction.emit('Hit [H key or LMB] or Stand [S key or RMB]?')

# Draw logic.
@draw = () ->
	scene.addChild(toggle_sound.draw())
	scene.addChild(dealer_pile.draw())
	scene.addChild(screentip.draw()[0])
	scene.addChild(screentip.draw()[1])
	scene.addChild(instruction.draw())
	scene.addChild(p_score.draw())
	scene.addChild(d_score.draw())
	i = 0
	while i < player_cards.length
		scene.addChild(player_cards[i].draw())
		i++
	i = 0
	while i < dealer_cards.length
		scene.addChild(dealer_cards[i].draw())
		i++

	game.pushScene(scene)

# Clear the table.
@clear = () ->
	scene.removeChild(screentip.draw()[0])
	scene.removeChild(screentip.draw()[1])
	scene.removeChild(instruction.draw())
	scene.removeChild(p_score.draw())
	scene.removeChild(d_score.draw())
	i = 0
	while i < player_cards.length
		scene.removeChild(player_cards[i].draw())
		i++
	i = 0
	while i < dealer_cards.length
		scene.removeChild(dealer_cards[i].draw())

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
		SoundEffects.play(game, 'hit')
		player_cards[player_index] = player.hit(cards)
		player_index++
		update()

	draw()

# Take a stand.
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

	showCards()

# Exit to project's repository on GitHub.
@exitToGitHub = () ->
	window.location.href = 'https://github.com/stpettersens/21'
