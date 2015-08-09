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
