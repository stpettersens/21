-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Card class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

Card = {}
Card.__index = Card

--- Get an image path from card string pattern.
-- @param card String representation for card.
-- @return Path to card graphic.
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

--- Card represents a single playing card.
-- @param card Path for card graphic.
-- @param posX X position for card.
function Card.create(card, posX, posY)
	local self = setmetatable({}, Card)
	self.src = card
	self.image = love.graphics.newImage(card)
	self.posX = posX
	self.posY = posY

	return self
end

--- Set X, Y position for card.
-- @param posX X position for card.
-- @param posY Y position for card.
function Card:setXY(posX, posY)
	self.posX = posX
	self.posY = posY
end

--- Get X, Y position of card.
-- @return X, Y position of card.
function Card:getXY()
	return self.posX, self.posY
end

--- Get source for image.
-- @return Image source (path). 
function Card:getImageSrc()
	return self.src
end

--- Draw the card.
function Card:draw()
	love.graphics.draw(self.image, self.posX, self.posY)
end
