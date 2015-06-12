"""
Blackjack [Pygame]

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

Dealer class
"""
import time
import pygame
from pygame.locals import *
from random import randrange
from termcolor import cprint
from card import Card

class Dealer:

	use_color = True
	cards = []
	values = []
	index = -1
	position = 225

	@staticmethod
	def receiveCards():

		Dealer.index += 1
		cardA = Card('bc.png', Dealer.position, 10)
		
		Dealer.index += 1
		Dealer.position += 90

		cardB = Card(Card.getImage(Dealer.cards[Dealer.index]), Dealer.position, 10)

		print(Dealer.index)
		print(Dealer.position)

		return cardA, cardB

	@staticmethod
	def revealFirstCard():
		return Card(Card.getImage(Dealer.cards[0]), 225, 10)

	def __init__(self):
		Dealer.cards = []
		Dealer.values = []

	def _calcTotal(self):
		Dealer.values.sort(reverse=True)
		total = 0
		for v in self.values:
			if v == 1:
				if total + 11 <= 21: v = 11
				if total + 11 > 21: v = 1
			total += v
		return total

	def _hit(self, cards):
		card = cards.draw()
		Dealer.cards.append(card)
		Dealer.values.append(cards.getValue())
		_print('Dealer hits.', 'magenta')
		_print('Dealer gets ' + card, 'magenta')

		return Card(Card.getImage(Dealer.cards[2]), 400, 10)

	def _stand(self):
		_print('Dealer stands.', 'magenta')

	def shuffle(self, cards):
		if cards.getPlayed() == 0 or cards.getPlayed() >= 45:
			_print('-------------------------------------------------------', 'magenta')
			_print('Dealer is shuffling cards...', 'magenta')
			_print('-------------------------------------------------------', 'magenta')
			time.sleep(2)
			return cards.shuffle()

	def deal(self, cards):
		dealt = []
		i = 0
		_print('-------------------------------------------------------', 'magenta')
		_print('Dealer is dealing cards for a new game...', 'magenta')
		_print('-------------------------------------------------------', 'magenta')
		while i < 2 * 2:
			dealt.append(cards.draw() + ':' + str(cards.getValue()))
			i = i + 1
		
		i = 0
		while i < 2:
			cv = dealt[i].split(':')
			Dealer.cards.append(cv[0])
			Dealer.values.append(int(cv[1]))
			i = i + 1

		time.sleep(2)
		_print('\nDealer has:', 'magenta')
		_print('[**]' + Dealer.cards[1], '')
		time.sleep(2)
		return dealt[2:]

	def hasBlackjack(self):
		if self._calcTotal() == 21:
			_print('Dealer has Blackjack!', 'magenta')
			return True

	def isBust(self):
		if self._calcTotal() > 21:
			_print('Dealer is bust!', 'magenta')
			return True

	def respond(self, cards):
		time.sleep(3)
		self.showCards()
		responding = True
		response_cards = []
		while responding:
			total = 0
			while total <= 18:
				total = self._calcTotal()
				time.sleep(2)
				if total == 16:
					if randrange(0, 5) >= 3:
						Dealer.index += 1
						Dealer.position += 90
						print(Dealer.index)
						print(Dealer.position)
						response_cards.append(self._hit(cards)) # Take risk.
					else:
						self._stand() # Play it safe.
				elif total >= 17:
					self._stand()
					responding = False
					break
				else:
					Dealer.index += 1
					Dealer.position += 90
					print(Dealer.index)
					print(Dealer.position)
					response_cards.append(self._hit(cards))

		return 'stand', response_cards

	def showCards(self):
		Dealer.index = -1
		Dealer.position = 225
		cards = ''
		for card in Dealer.cards:
			cards += card

		_print('\nDealer has:', 'magenta')
		_print('{0} --> {1}'.format(cards, self._calcTotal()), '')
		return self._calcTotal()

def _print(message, color):
	if Dealer.use_color and color != '':
		cprint(message, color)
	else:
		print(message)
