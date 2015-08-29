-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

--- Player class for Blackjack.
-- @copyright 2015 Sam Saint-Pettersen

require 'helpers'
require 'card'
require 'debug'

Player = {}
Player.__index = Player

--- Player implements the player for Blackjack.
-- @constructor
-- @param [boolean] debug Enable debug messages?
function Player.create(debug)
	local self = setmetatable({}, Player)
	self.debug = debug
	self.index = 0
	self.pos = 225
	self.cards = {}
	self.values = {}
	return self
end

--- Calculate the total value of player's held cards.
-- @param [number] Total value for player's cards.
function Player:calcTotal()
	Helper.bubbleSort(self.values, true)
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

--- Determine if player has Blackjack.
-- @return [boolean] Does player have Blackjack?
function Player:hasBlackjack()
	local blackjack = false
	if self:calcTotal() == 21 then
		Debug_emit(self.debug, 'Player has Blackjack!')
		blackjack = true
	end
	return blackjack
end

--- Determine if player is bust.
-- @return [boolean] Does player is bust?
function Player:isBust()
	local bust = false
	if self:calcTotal() > 21 then
		Debug_emit(self.debug, 'Player is bust!')
		bust = true
	end
	return bust
end

--- Receive cards from dealer.
-- @param [{string}] player_cards Player's cards as table of strings.
-- @return [Card, Card] Player's cards as tuple of Card[s].
function Player:receiveCards(player_cards)
	local pc = ''
	for i = 1, #player_cards do
		card, value = player_cards[i]:match('%[(%w+)%]:(%d+)')
		table.insert(self.cards,  card)
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

--- Player hits.
-- @param [Cards] cards Game cards.
-- @return [Card] Player's drawn card.
function Player:hit(cards)
	local card = cards:draw()
	table.insert(self.cards, card)
	table.insert(self.values, cards:getValue())
	self.index = self.index + 1
	self.pos = self.pos + 90
	Debug_emit(self.debug, 'Player hits.')
	Debug_emit(self.debug, 'Player gets ' .. card)
	Debug_emit(self.debug, 'Player has ' .. tostring(self:calcTotal()))

	return Card.create(Card_getImage(card:match('%[(%w+)%]')), self.pos, 310)
end

--- Player stands.
function Player:stand()
	Debug_emit(self.debug, 'Player stands.')
	Debug_emit(self.debug, 'Player has ' .. tostring(self:calcTotal()))
end

--- Show player's cards.
-- @return [number] Total value of player's cards.
function Player:showCards()
	self.index = 0
	self.pos = 225
	local cards = ''
	for i = 1, #self.cards do
		cards = string.format('%s[%s]', cards, self.cards[i])
	end
	Debug_emit(self.debug, '\nPlayer has:')
	Debug_emit(self.debug, string.format('%s --> %d', cards, self:calcTotal()))

	return self:calcTotal()
end
