-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

require 'helpers'
require 'card'

AI = {}
AI.__index = AI

debug = false

function AI.create(debug)
	local self = setmetatable({}, AI)
	debug = debug
	self.index = 0
	self.pos = 255
	self.cards = {}
	self.values = {}
	return self
end

function AI:calcTotal()
	Helper_bubbleSort(self.values, true)
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

function AI:hasBlackjack()
	local blackjack = false
	if self:calcTotal() == 21 then
		_print('\nPlayer has Blackjack!')
		blackjack = true
	end
	return blackjack
end

function AI:isBust()
	local bust = false
	if self:calcTotal() > 21 then
		_print('\nPlayer is bust!')
		bust = true
	end
	return bust
end

function AI:receiveCards(player_cards)
	local pc = ''
	for i = 1, #player_cards do
		card, value = player_cards[i]:match('%[(%w+)%]:(%d+)')
		table.insert(self.cards, card)
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

function AI:_hit(cards)
	card = cards:draw()
	table.insert(self.cards, card)
	table.insert(self.values, cards:getValue())
	_print('Player hits.')
	_print('Player gets ' .. card)

	return Card.create(Card_getImage(card:match('%[(%w+)%]')), self.pos, 310)
end

function AI:_stand()
	_print('Player stands.')
	_print('Player has ' .. tostring(self:calcTotal()))
end

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

function AI:showCards()
	local cards = ''
	for i = 1, #self.cards do
		cards = string.format('%s%s', cards, self.cards[i])
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

