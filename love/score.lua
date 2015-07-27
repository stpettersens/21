-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Score class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

require 'debug'

Score = {}
Score.__index = Score

--- Score implements a score or information box.
-- @param debug Enable debug messages?
-- @param posX X position for score box.
-- @param posY Y position for score box.
function Score.create(debug, posX, posY)
	local self = setmetatable({}, Screentip)
	self.posX = posX
	self.posY = posY
	self.score = ''

	Debug_emit(debug, string.format("Created score counter at %d,%d", posX, posY)) --!
	return self
end

--- Emit a score or similar message.
-- @param score Score or similar message to emit.
function Score:emit(score)
	self:clear()
	self.score = tostring(score)
end

--- Clear the score box.
function Score:clear()
	self.score = ''
end

--- Draw the score box.
function Score:draw()
	love.graphics.print(self.score, self.posX, self.posY)
end
