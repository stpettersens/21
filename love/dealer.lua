-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Dealer class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

require 'helpers'
require 'card'
require 'debug'

Dealer = {}
Dealer.__index = Dealer

--- Dealer implements the dealer for Blackjack.
-- @constructor
-- @param [boolean] debug Enable debug messages?
function Dealer.create(debug)
	local self = setmetatable({}, Dealer)
	self.debug = debug
	self.index = 0
	self.pos = 225
	self.cards = {}
	self.values = {}
	return self
end

--- Calculate the total value of dealer's held cards.
-- @return [number] Total value of dealer's cards.
function Dealer:calcTotal()
	Helper_bubbleSort(self.values, true)
	local total = 0
	for i = 1, #self.values do
		local v = self.values[i]
		if v == 1 then
			if (total + 11) <= 21 then
				v = 11
			elseif (total + 11) > 21 then
				v = 1
			end

		end
		total = total + v
	end
	return total
end

--- Dealer hits.
-- @private
-- @param [Cards] cards Game cards.
-- @return [Card] Dealer's drawn card.
function Dealer:_hit(cards)
	self.index = self.index + 1
	self.pos = self.pos + 90
	card = cards:draw()
	table.insert(self.cards, card)
	table.insert(self.values, cards:getValue())
	Debug_emit(self.debug, self.debug, 'Dealer hits.')
	Debug_emit(self.debug, self.debug, 'Dealer gets ' .. card)

	return Card.create(Card_getImage(card), self.pos, 10)
end

--- Dealer stands.
-- @private
function Dealer:_stand()
	Debug_emit(self.debug, 'Dealer stands.')
end

--- Dealer shuffles.
-- @param [Cards] cards Game cards to shuffle.
function Dealer:shuffle(cards)
	if cards:getPlayed() == 0 or cards:getPlayed() >= 45 then
		Debug_emit(self.debug, '-------------------------------------------------------')
		Debug_emit(self.debug, 'Dealer is shuffling cards...')
		Debug_emit(self.debug, '-------------------------------------------------------')
		return cards:shuffle()
	end
end

--- Dealer deals.
-- @param [Cards] cards Game cards.
-- @return [{string}] Player's cards.
function Dealer:deal(cards)
	local dealt = {}
	local i = 1
	Debug_emit(self.debug, '-------------------------------------------------------')
	Debug_emit(self.debug, 'Dealer is dealing cards for a new game...')
	Debug_emit(self.debug, '-------------------------------------------------------')
	while i <= (2 * 2) do
		table.insert(dealt, string.format('%s:%d', cards:draw(), cards:getValue()))
		i = i + 1
	end
	i = 1
	local card = nil
	local value = nil
	while i <= 2 do
		card, value = dealt[i]:match('%[(%w+)%]:(%d+)')
		table.insert(self.cards, card)
		table.insert(self.values, tonumber(value))
		i = i + 1
	end
	Debug_emit(self.debug, '\nDealer has:')
	Debug_emit(self.debug, string.format('[**][%s]', self.cards[2]))
	return {dealt[3], dealt[4]}
end

--- Determine if dealer has Blackjack.
-- @return [boolean] Does dealer have Blackjack?
function Dealer:hasBlackjack()
	local blackjack = false
	if self:calcTotal() == 21 then
		Debug_emit(self.debug, 'Dealer has Blackjack!')
		blackjack = true
	end
	return blackjack
end

--- Determine if dealer is bust.
-- @return [boolean] Is dealer bust?
function Dealer:isBust()
	local bust = false
	if self:calcTotal() > 21 then
		Debug_emit(self.debug, 'Dealer is bust!')
		bust = true
	end
	return bust
end

--- Dealer responds to player action (e.g. a hit or stand).
-- @param [Cards] cards Game cards.
-- @return [{Card}] Cards returned.
function Dealer:respond(cards)
	self:showCards()
	local responding = true
	local response_cards = {}
	while responding do
		local total = 0
		while total <= 18 do
			total = self:calcTotal()
			if total == 16 then
				if love.math.random(0, 5) >= 3 then
					table.insert(response_cards, self:_hit(cards)) -- Take risk.
				else
					self:_stand() -- Play it safe.
				end
			elseif total >= 17 then
				self:_stand()
				responding = false
				break
			else
				table.insert(response_cards, self:_hit(cards))
			end
		end
	end
	return response_cards
end

--- Show dealer's cards.
-- @return [number] Total value of dealer's cards.
function Dealer:showCards()
	self.index = 0
	self.pos = 225
	local cards = ''
	for i = 1, #self.cards do
		cards = string.format('%s[%s]', cards, self.cards[i])
	end
	Debug_emit(self.debug, '\nDealer has:')
	Debug_emit(self.debug, string.format('%s --> %d', cards, self:calcTotal()))

	return self:calcTotal()
end

--- Dealer receives cards.
-- @return [Card, Card] Dealer's received cards.
function Dealer:receiveCards()
	self.index = self.index + 1
	local cardA = Card.create(Card_getImage('c'), self.pos, 10)

	self.index = self.index + 1
	self.pos = self.pos + 90

	local cardB = Card.create(Card_getImage(self.cards[self.index]), self.pos, 10)

	return cardA, cardB
end

--- Dealer reveals first card.
-- @return [Card] Revealed first card.
function Dealer:revealFirstCard()
	return Card.create(Card_getImage(self.cards[1]), 225, 10)
end
