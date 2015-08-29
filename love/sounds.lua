-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- SoundEffects class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

s = 'sfx/'
soundOn = true

--- Toggle sound effects on/off.
-- @return [boolean] Are sound effects on?
function SoundEffects_toggle()
	if soundOn then
		soundOn = false
	else
		soundOn = true
	end
	return soundOn
end

--- Play sound effect.
-- @param [string] effect Name of sound effect to play.
function SoundEffects_play(effect)
	local e = love.audio.newSource(s .. effect .. '.ogg', 'static')
	love.audio.play(e)
end
