-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Cards class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

require 'helpers'

Cards = {}
Cards.__index = Cards

index = 0
deck_num = 52
deck = {}
played = {}

---Card implements a collection of playing cards
-- and methods to draw and shuffle.
-- @constructor
function Cards.create()
	local self = setmetatable({}, Cards)

	self.sorted_hearts = {}
	self.sorted_diamonds = {}
	self.sorted_clubs = {}
	self.sorted_spades = {}
	
	self.ranks = {'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'}
	self.suits = {'h', 'd', 'c', 's'}

	return self
end

--- Get a rank for a card.
-- @private
-- @return [string] Card rank.
function Cards:_getRank()
	local i = love.math.random(1, #self.ranks)
	return tostring(self.ranks[i])
end

--- Get a suite for a card.
-- @private
-- @return [string] Card suit.
function Cards:_getSuit()
	local i = love.math.random(1, #self.suits)
	return tostring(self.suits[i])
end

--- Get a card.
-- @private
-- @return Card as string.
function Cards:_getCard()
	return string.format('%s %s', self:_getRank(), self:_getSuit())
end

--- Shuffle cards.
function Cards:shuffle()
	index = 0
	deck = {}
	played = {}
	while true do
		local card = self:_getCard()
		if not Helper.inTable(card, deck) then
			table.insert(deck, card)
			if #deck == deck_num then
				break
			end
		end
	end
end

-- Sort cards.
function Cards:sort()
	self.sorted_hearts = {}
	self.sorted_diamonds = {}
	self.sorted_clubs = {}
	self.sorted_spades = {}
	for i = 1, #deck do
		local rank = nil
		local suit = nil
		rank, suit = deck[i]:match('([^,]+)%s([^,]+)')
		local num = 0
		if rank == 'A' then 		-- Ace
			num = 1
		elseif rank == 'J' then		-- Jack
			num = 11
		elseif rank == 'Q' then		-- Queen
			num = 12
		elseif rank == 'K' then		-- King
			num = 13
		else
			num = tonumber(rank)	-- 2 to 10
		end
		if suit == 'h' then -- Hearts
			if not Helper.inTable(num, self.sorted_hearts) then
				table.insert(self.sorted_hearts, num)
			end

		elseif suit == 'd' then -- Diamonds
			if not Helper.inTable(num, self.sorted_diamonds) then
				table.insert(self.sorted_diamonds, num)
			end

		elseif suit == 'c' then -- Clubs
			if not Helper.inTable(num, self.sorted_clubs) then
				table.insert(self.sorted_clubs, num)
			end

		elseif suit == 's' then -- Spades
			if not Helper.inTable(num, self.sorted_spades) then
				table.insert(self.sorted_spades, num)
			end
		end
	end

	-- Sort processed cards, lowest to highest.
	table.sort(self.sorted_hearts)
	table.sort(self.sorted_diamonds)
	table.sort(self.sorted_clubs)
	table.sort(self.sorted_spades)

	local hearts = ''
	for i = 1, #self.sorted_hearts do
		local heart = self.sorted_hearts[i]
		if heart == 1 then
			heart = 'A'
		elseif heart == 11 then
			heart = 'J'
		elseif heart == 12 then
			heart = 'Q'
		elseif heart == 13 then
			heart = 'K'
		end
		hearts = string.format('%s[%sh]', hearts, tostring(heart))
	end

	local diamonds = ''
	for i = 1, #self.sorted_diamonds do
		local diamond = self.sorted_diamonds[i]
		if diamond == 1 then
			diamond = 'A'
		elseif diamond == 11 then
			diamond = 'J'
		elseif diamond == 12 then
			diamond = 'Q'
		elseif diamond == 13 then
			diamond = 'K'
		end
		diamonds = string.format('%s[%sd]', diamonds, tostring(diamond))
	end

	local clubs = ''
	for i = 1, #self.sorted_clubs do
		local club = self.sorted_clubs[i]
		if club == 1 then
			club = 'A'
		elseif club == 11 then
			club = 'J'
		elseif club == 12 then
			club = 'Q'
		elseif club == 13 then
			club = 'K'
		end
		clubs = string.format('%s[%sc]', clubs, club)
	end

	local spades = ''
	for i = 1, #self.sorted_spades do
		local spade = self.sorted_spades[i]
		if spade == 1 then
			spade = 'A'
		elseif spade == 11 then
			spade = 'J'
		elseif spade == 12 then
			spade = 'Q'
		elseif spade == 13 then
			spade = 'K'
		end
		spades = string.format('%s[%ss]', spades, spade)
	end

	return string.format('Sorted cards:\nH %s\nD %s\nC %s\nS %s\n', hearts, diamonds, clubs, spades)
end

--- Draw a card.
-- @return [string] Drawn card as string.
function Cards:draw()
	if #played == deck_num or index == 0 then
		index = 1
	end
	table.insert(played, deck[index])
	local rank = nil
	local suit = nil
	rank, suit = deck[index]:match('([^,]+)%s([^,]+)')
	return string.format('[%s%s]', rank, suit)
end

--- Get a card's value.
-- @return [number] Card's value.
function Cards:getValue()
	local rank = nil
	local suit = nil
	rank, suit = deck[index]:match('([^,]+)%s([^,]+)')
	index = index + 1
	local value = 0
	if rank == 'A' then
		value = 1
	elseif rank == 'J' or rank == 'Q' or rank == 'K' then
		value = 10
	else
		value = rank
	end

	return tonumber(value)
end

--- Get number of played cards.
-- @return [number] Number of cards played.
function Cards:getPlayed()
	return tonumber(#played)
end

--- Draw all cards from the deck.
-- @return [string] All cards from deck.
function Cards:drawAll()
	local draws = ' '
	for i = 1, deck_num do
		draws = string.format('%s %s ', draws, self:draw())
	end
	return tostring(draws)
end
