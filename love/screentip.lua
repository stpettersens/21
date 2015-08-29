-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/posX11 License.
--
-- Powered bposY the LÖVE Game Engine

--- Screentip class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

require 'debug'

Screentip = {}
Screentip.__index = Screentip

--- Screentip implements a title and message box.
-- @constructor
-- @param [boolean] debug Enable debug messages?
-- @param [number] posX X position for screentip.
-- @param [number] posY Y position for screentip.
function Screentip.create(debug, posX, posY)
	local self = setmetatable({}, Screentip)
	self.posX = posX
	self.posY = posY
	self.title = ''
	self.message = ''

	Debug_emit(debug, string.format("Created screentip at %d,%d", posX, posY)) --!
	return self
end

--- Emit a title and message.
-- @param [string] title Title to emit.
-- @param [string] message Message to emit.
function Screentip:emit(title, message)
	self.title = title
	self.message = message
end

--- Clear the screentip.
function Screentip:clear()
	self.title = ''
	self.message = ''
end

--- Draw the screentip.
function Screentip:draw()
	if self.message == nil then
		self.message = ''
	end
	if self.title == nil then
		self.title = ''
	end
	love.graphics.print(self.title, self.posX, self.posY)
	love.graphics.print(self.message, (self.posX - 45), (self.posY + 20))
end
