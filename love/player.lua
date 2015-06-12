-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

require 'helpers'
require 'card'

Player = {}
Player.__index = Player

debug = false

function Player.create(debug)
	local self = setmetatable({}, Player)
	debug = debug
	self.index = 0
	self.pos = 225
	self.cards = {}
	self.values = {}
	return self
end

function Player:calcTotal()
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

function Player:hasBlackjack()
	local blackjack = false
	if self:calcTotal() == 21 then
		_print('Player has Blackjack!')
		blackjack = true
	end
	return blackjack
end

function Player:isBust()
	local bust = false
	if self:calcTotal() > 21 then
		_print('Player is bust!')
		bust = true
	end
	return bust
end

function Player:receiveCards(player_cards)
	local pc = ''
	for i = 1, #player_cards do
		card, value = player_cards[i]:match('%[(%w+)%]:(%d+)')
		table.insert(self.cards,  card)
		table.insert(self.values, tonumber(value))
	end
	pc = string.format('%s[%s][%s]', pc, self.cards[1], self.cards[2])
	_print('\nPlayer receives their cards:')
	_print(string.format('%s --> %d', pc, self:calcTotal()))

	self.index = self.index + 1
	cardA = Card.create(Card_getImage(self.cards[self.index]), self.pos, 310)

	self.index = self.index + 1
	self.pos = self.pos + 90
	cardB = Card.create(Card_getImage(self.cards[self.index]), self.pos, 310)
	return cardA, cardB
end

function Player:hit(cards)
	local card = cards:draw()
	table.insert(self.cards, card)
	table.insert(self.values, cards:getValue())
	self.index = self.index + 1
	self.pos = self.pos + 90
	_print('Player hits.')
	_print('Player gets ' .. card)
	_print('Player has ' .. tostring(self:calcTotal()))

	return Card.create(Card_getImage(card:match('%[(%w+)%]')), self.pos, 310)
end

function Player:stand()
	_print('Player stands.')
	_print('Player has ' .. tostring(self:calcTotal()))
end

function Player:showCards()
	self.index = 0
	self.pos = 225
	local cards = ''
	for i = 1, #self.cards do
		cards = string.format('%s[%s]', cards, self.cards[i])
	end
	_print('\nPlayer has:')
	_print(string.format('%s --> %d', cards, self:calcTotal()))

	return self:calcTotal()
end

function _print(message)
	if debug then
		print(message)
	end
end

