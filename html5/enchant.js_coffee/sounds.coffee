# Sound effects for generated game.
s = 'sounds/'
sounds = [ 
s + 'shuffle.ogg',
s + 'deal.ogg',
s + 'reveal.ogg',
s + 'hit.ogg' 
]

soundOn = true
class SoundEffects
	# Toggle sound effects on/off.
	# @return [Boolean] Is sound on?
	@toggle: () ->
		if soundOn 
			soundOn = false
		else
			soundOn = true

		return soundOn

	# Play named sound effect.
	# @param [Core] game Enchant.js game object
	# @param [String] effect Name of sound effect to play
	@play: (game, effect) ->
		if soundOn
			if game.sfx
				game.assets["#{s}#{effect}.ogg"].play()
			else
				new Audio("#{s}#{effect}.ogg").play()
