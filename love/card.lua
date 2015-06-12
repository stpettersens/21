-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

Card = {}
Card.__index = Card

--@staticmethod
function Card_getImage(card)
	local suit = ''
	if card:match('(h)') ~= nil then
		suit = 'h'
	elseif card:match('(d)') ~= nil then
		suit = 'd'
	elseif card:match('(c)') ~= nil then
		suit = 'c'
	elseif card:match('(s)') ~= nil then
		suit = 's'
	end
	local rank = card:match('%[*(%d*%u*)%]*')
	return string.format('gfx/%s%s.png', suit, rank)
end

function Card.create(card, pos_x, pos_y)
	local self = setmetatable({}, Card)
	self.png = card
	self.image = love.graphics.newImage(card)
	self.pos_x = pos_x
	self.pos_y = pos_y

	return self
end

function Card:setXY(pos_x, pos_y)
	self.pos_x = pos_x
	self.pos_y = pos_y
end

function Card:getXY()
	return self.pos_x, self.pos_y
end

function Card:getPNG()
	return self.png
end

function Card:draw()
	love.graphics.draw(self.image, self.pos_x, self.pos_y)
end

function Card:update(dt)
	self.pos_x = self.pos_x
	self.pos_y = self.pos_y
end

function Card:change(card)
	self.image = love.graphics.newImage(card)
end
