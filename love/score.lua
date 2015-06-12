-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

Score = {}
Score.__index = Score

debug = false

function Score.create(debug, x, y)
	local self = setmetatable({}, Screentip)
	debug = debug
	self.x = x
	self.y = y
	self.score = ''

	_print(string.format("Created score counter at %d,%d", self.x, self.y)) --!
	return self
end

function Score:emit(score)
	self:clear()
	self.score = tostring(score)
end

function Score:clear()
	self.score = ''
end

function Score:draw()
	love.graphics.print(self.score, self.x, self.y)
end

function _print(message)
	if debug then
		print(message)
	end
end


