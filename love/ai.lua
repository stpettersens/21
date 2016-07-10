-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- AI class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

require 'helpers'
require 'card'
require 'debug'

AI = {}
AI.__index = AI

--- AI implements an artifical player (not the dealer).
-- @constructor
-- @param [boolean] debug Enable Debug. messages?
function AI.create(debug)
	local self = setmetatable({}, AI)
	self.debug = debug
	self.index = 0
	self.pos = 255
	self.cards = {}
	self.values = {}
	return self
end

--- Calculate the total value of AI's held cards.
-- @return [number] Total value of AI's cards.
function AI:calcTotal()
	Helper.bubbleSort(self.values, true)
	local total = 0
	for i =1, #self.values do
		local v = self.values[i]
		if v == 1 then
			if (total + 11) <= 21 then
				v = 11
			end
		end
		total = total + v
	end
	return total
end

--- Determine if AI has Blackjack.
-- @return [boolean] Does AI have Blackjack?
function AI:hasBlackjack()
	local blackjack = false
	if self:calcTotal() == 21 then
		Debug_emit(self.debug, '\nPlayer has Blackjack!')
		blackjack = true
	end
	return blackjack
end

--- Determine if dealer is bust.
-- @return [boolean] Is dealer bust?
function AI:isBust()
	local bust = false
	if self:calcTotal() > 21 then
		Debug_emit(self.debug, '\nPlayer is bust!')
		bust = true
	end
	return bust
end

--- AI receives cards from dealer.
-- @param ai_cards AI's cards as table of strings.
-- @return [{Card}] AI's cards as table of Card(s).
function AI:receiveCards(ai_cards)
	local pc = ''
	for i = 1, #ai_cards do
		card, value = ai_cards[i]:match('%[(%w+)%]:(%d+)')
		table.insert(self.cards, card)
		table.insert(self.values, tonumber(value))
	end
	pc = string.format('%s[%s][%s]', pc, self.cards[1], self.cards[2])
	Debug_emit(self.debug, '\nPlayer receives their cards:')
	Debug_emit(self.debug, string.format('%s --> %d', pc, self:calcTotal()))

	self.index = self.index + 1
	cardA = Card.create(Card_getImage(self.cards[self.index]), self.pos, 310)

	self.index = self.index + 1
	self.pos = self.pos + 90
	cardB = Card.create(Card_getImage(self.cards[self.index]), self.pos, 310)
	return cardA, cardB
end

--- AI hits.
-- @private
function AI:_hit(cards)
	card = cards:draw()
	table.insert(self.cards, card)
	table.insert(self.values, cards:getValue())
	Debug_emit(self.debug, 'Player hits.')
	Debug_emit(self.debug, 'Player gets ' .. card)

	return Card.create(Card_getImage(card:match('%[(%w+)%]')), self.pos, 310)
end

--- AI stands.
-- @private
function AI:_stand()
	Debug_emit(self.debug, 'Player stands.')
	Debug_emit(self.debug, 'Player has ' .. tostring(self:calcTotal()))
end

--- AI responds to cards received or dealer.
-- @param [Cards] Game cards.
-- @return [{Card}] Response cards.
function AI:respond(cards)
	self:showCards()
	local responding = true
	local response_cards = {}
	while responding do
		local total = 0
		while total <= 18 do
			total = self:calcTotal()
			if total == 16 then
				if love.math.random(0, 5) >= 3 then
					self.index = self.index + 1
					self.pos = self.pos + 90
					table.insert(response_cards, self:_hit(cards)) -- Take risk.
				else
					self:_stand() -- Play it safe.
				end
			elseif total >= 17 then
				self:_stand()
				responding = false
				break
			else
				self.index = self.index + 1
				self.pos = self.pos + 90
				table.insert(response_cards, self:_hit(cards))
			end
		end
	end
	return response_cards
end

--- Show AI's cards.
-- @return [number] Total value of AI's cards.
function AI:showCards()
	local cards = ''
	for i = 1, #self.cards do
		cards = string.format('%s%s', cards, self.cards[i])
	end
	Debug_emit(self.debug, '\nPlayer has:')
	Debug_emit(self.debug, string.format('%s --> %d', cards, self:calcTotal()))
	return self:calcTotal()
end
