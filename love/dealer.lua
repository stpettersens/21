-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

require 'helpers'
require 'card'

Dealer = {}
Dealer.__index = Dealer

debug = false

function Dealer.create(debug)
	local self = setmetatable({}, Dealer)
	debug = debug
	self.index = 0
	self.pos = 225
	self.cards = {}
	self.values = {}
	return self
end

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

function Dealer:_hit(cards)
	self.index = self.index + 1
	self.pos = self.pos + 90
	card = cards:draw()
	table.insert(self.cards, card)
	table.insert(self.values, cards:getValue())
	_print('Dealer hits.')
	_print('Dealer gets ' .. card)

	return Card.create(Card_getImage(card), self.pos, 10)
end

function Dealer:_stand()
	_print('Dealer stands.')
end

function Dealer:shuffle(cards)
	if cards:getPlayed() == 0 or cards:getPlayed() >= 45 then
		_print('-------------------------------------------------------')
		_print('Dealer is shuffling cards...')
		_print('-------------------------------------------------------')
		return cards:shuffle()
	end
end

function Dealer:deal(cards)
	local dealt = {}
	local i = 1
	_print('-------------------------------------------------------')
	_print('Dealer is dealing cards for a new game...')
	_print('-------------------------------------------------------')
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
	_print('\nDealer has:')
	_print(string.format('[**][%s]', self.cards[2]))
	return {dealt[3], dealt[4]}
end

function Dealer:hasBlackjack()
	local blackjack = false
	if self:calcTotal() == 21 then
		_print('Dealer has Blackjack!')
		blackjack = true
	end
	return blackjack
end

function Dealer:isBust()
	local bust = false
	if self:calcTotal() > 21 then
		_print('Dealer is bust!')
		bust = true
	end
	return bust
end

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

function Dealer:showCards()
	self.index = 0
	self.pos = 225
	local cards = ''
	for i = 1, #self.cards do
		cards = string.format('%s[%s]', cards, self.cards[i])
	end
	_print('\nDealer has:')
	_print(string.format('%s --> %d', cards, self:calcTotal()))

	return self:calcTotal()
end

function Dealer:receiveCards()
	self.index = self.index + 1
	local cardA = Card.create(Card_getImage('c'), self.pos, 10)

	self.index = self.index + 1
	self.pos = self.pos + 90

	local cardB = Card.create(Card_getImage(self.cards[self.index]), self.pos, 10)

	return cardA, cardB
end

function Dealer:revealFirstCard()
	return Card.create(Card_getImage(self.cards[1]), 225, 10)
end

function _print(message)
	if debug then
		print(message)
	end
end

