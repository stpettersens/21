-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

Chip = {}
Chip.__index = Chip

--@staticmethod
function Chip_getImage(color)
	return string.format('gfx/c_%s.png', color)
end

function Chip.create(chip, pos_x, pos_y)
	local self = setmetatable({}, Chip)
	self.png = chip
	self.image = love.graphics.newImage(chip)
	self.pos_x = pos_x
	self.pos_y = pos_y

	return self
end

function Chip:setXY(pos_x, pos_y)
	self.pos_x = pos_x
	self.pos_y = pos_y
end

function Chip:getXY()
	return self.pos_x, self.pos_y
end

function Chip:getPNG()
	return self.png
end

function Chip:draw()
	love.graphics.draw(self.image, self.pos_x, self.pos_y)
end

function Chip:update(dt)
	self.pos_x = self.pos_x
	self.pos_y = self.pos_y
end

function Chip:change(chip)
	self.image = love.graphics.newImage(chip)
end
