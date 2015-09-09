-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Chip class for Blackjack (currently unused).
-- @copyright 2015 Sam Saint-Pettersen

Chip = {}
Chip.__index = Chip

--- Get an image path from chip color.
-- @param [string] color Color string for chip.
-- @return [string] Path to chip graphic.
function Chip_getImage(color)
	return string.format('gfx/c_%s.png', color)
end

--- Chip represents a single betting chip.
-- @constructor
-- @param [string] chip Path to chip graphic.
-- @param [number] posX X position for chip.
-- @param [number] posY Y position for chip.
function Chip.create(chip, posX, posY)
	local self = setmetatable({}, Chip)
	self.chip = chip
	self.image = love.graphics.newImage(chip)
	self.posX = posX
	self.posY = posY

	return self
end

--- Set X, Y position for chip.
-- @param [number] posX X position for chip.
-- @param [number] posY Y position for chip.
function Chip:setXY(posX, posY)
	self.posX = posX
	self.posY = posY
end

--- Get X, Y position of chip.
-- @return [number, number] X, Y position of chip.
function Chip:getXY()
	return self.posX, self.posY
end

--- Get source for image.
-- @return [string] Image source (path).
function Chip:getImageSrc()
	return self.chip
end

--- Draw the chip.
function Chip:draw()
	love.graphics.draw(self.image, self.posX, self.posY)
end
