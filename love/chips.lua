-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Chips class for Blackjack (currently unused).
-- @copyright 2015 Sam Saint-Pettersen

Chips = {}
Chips.__index = Chips

deck_white = 0
deck_red = 0
deck_blue = 0
deck_green = 0
deck_black = 0

--- Chip represents a collection of betting chips.
-- @constructor
function Chips.create()
	local self = setmetatable({}, Chips)
	
	self.colors = { 'white', 'red', 'blue', 'green', 'black' }
	self.dollars = { 1, 5, 10, 25, 100 }

	return self
end

--- Get chip currency value from color.
-- @private
-- @param [string] color Color of the chip.
function Chips:_getChip(color)
	local value = 0
	if color == 'white' then
		value = self.dollars[1]
	elseif color == 'red' then
		value = self.dollars[2]
	elseif color == 'blue' then
		value = self.dollars[3]
	elseif color == 'green' then
		value = self.dollars[4]
	elseif color == 'black' then
		value = self.dollars[5]
	end
	return value
end

--- Deal chips for a given betting balance.
-- @param [number] balance Currency amount available to bet.
function Chips:deal(balance)
	deck_white = 0
	deck_red = 0
	deck_blue = 0
	deck_green = 0
	deck_black = 0
	print(balance)
	-- Deal out white chips.
	for i = 1, math.floor(balance / 1) do
		deck_white = deck_white + 1
	end
	-- Deal out red chips.
	for i = 1, math.floor(balance / 5) do
		deck_red = deck_red + 1
	end
	-- Deal out blue chips.
	for i = 1, math.floor(balance / 10) do
		deck_blue = deck_blue + 1
	end
	-- Deal out green chips.
	for i = 1, math.floor(balance / 25) do
		deck_green = deck_green + 1
	end
	-- Deal out black chips.
	for i = 1, math.floor(balance / 100) do
		deck_black = deck_black + 1
	end
end

--- Draw a chip.
-- @param [string] color Color of chosen chip.
-- @param [number] balance Currency amount available to bet.
function Chips:draw(color, balance)
	if balance > 0 then
		local bet = 0
		if color == 'white' and balance >= 1 then
			bet = self:_getChip('white')
		elseif color == 'red' and balance >= 5 then
			bet = self:_getChip('red')
		elseif color == 'blue' and balance >= 10 then
			bet = self:_getChip('blue')
		elseif color == 'green' and balance >= 25 then
			bet = self:_getChip('green')
		elseif color == 'black' and balance >= 100 then
			bet = self:_getChip('black')
		end
		balance = balance - bet;
		return string.format('%s', color), balance
	end
	return nil, 0
end

--- Get number of available chips.
-- @return [number] Number of chips.
function Chips:getNums()
	return deck_white, deck_red, deck_blue, deck_green, deck_black
end
