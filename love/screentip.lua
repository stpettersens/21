-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

Screentip = {}
Screentip.__index = Screentip

debug = debug

function Screentip.create(debug, x, y)
	local self = setmetatable({}, Screentip)
	debug = debug
	self.x = x
	self.y = y
	self.title = ''
	self.message = ''

	_print(string.format("Created screentip at %d,%d", self.x, self.y)) --!
	return self
end

function Screentip:emit(title, message)
	self.title = title
	self.message = message
end

function Screentip:clear()
	self.title = ''
	self.message = ''
end

function Screentip:draw()
	if self.message == nil then
		self.message = ''
	end
	if self.title == nil then
		self.title = ''
	end
	love.graphics.print(self.title, self.x, self.y)
	love.graphics.print(self.message, (self.x - 45), (self.y + 20))
end

function _print(message)
	if debug then
		print(message)
	end
end

