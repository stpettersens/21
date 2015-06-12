# -*- coding: utf-8 -*-
"""
Blackjack [Pygame]

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

Player class
"""
import pygame
from pygame.locals import *
from termcolor import cprint, colored
from card import Card

class Player:

	use_color = True
	cards = []
	values = []
	index = -1
	position = 225 

	def __init__(self):
		Player.cards = []
		Player.values = []

	def calcTotal(self):
		Player.values.sort(reverse=True)
		total = 0
		for v in Player.values:
			if v == 1:
				if total + 11 <= 21: v = 11
				if total + 11 > 21: v = 1
			total += v
		return total

	def hasBlackjack(self):
		if self.calcTotal() == 21:
			_print('Player has Blackjack!', 'magenta')
			return True

	def isBust(self):
		if self.calcTotal() > 21:
			_print('Player is bust!', 'magenta')
			return True
		
	def receiveCards(self, player_cards):
		cards = ''
		for card in player_cards:
			cv = card.split(':')
			Player.cards.append(cv[0])
			Player.values.append(int(cv[1]))
		
		cards += Player.cards[0] + Player.cards[1]
		_print('Player receives their cards:', 'magenta')
		_print('{0} --> {1}'.format(cards, self.calcTotal()), '')

		Player.index += 1

		cardA = Card(Card.getImage(Player.cards[Player.index]), Player.position, 350)

		Player.index += 1
		Player.position += 90

		cardB = Card(Card.getImage(Player.cards[Player.index]), Player.position, 350)

		return cardA, cardB
		
	def hit(self, cards):
		card = cards.draw()
		Player.cards.append(card)
		Player.values.append(cards.getValue())
		Player.index +=  1
		Player.position += 90
		_print('Player hits.', 'magenta')
		_print('Player gets ' + card, 'magenta')
		_print('Player has ' + str(self.calcTotal()), 'magenta')

	def stand(self):
		_print('Player stands.', 'magenta')
		_print('Player has ' + str(self.calcTotal()), 'magenta')

	def showCards(self):
		Player.index = -1
		Player.position = 225
		cards = ''
		for card in Player.cards:
			cards += card

		_print('\nPlayer has:', 'magenta')
		_print('{0} --> {1}'.format(cards, self.calcTotal()), '')
		return self.calcTotal()

def _print(message, color):
	if Player.use_color and color != '':
		cprint(message, color)
	else:
		print(message)
