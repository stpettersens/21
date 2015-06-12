# -*- coding: utf-8 -*-
"""
Blackjack

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

Card class
"""
from random import randrange
from termcolor import colored

class Cards:

	use_color = True

	index = -1
	deck = []
	played = []
	sorted_hearts = []
	sorted_diamonds = []
	sorted_clubs = []
	sorted_spades = []
	deck_num = 52	
	ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
	suits = ['♥','♦','♣','♠']

	def __init__(self, color):
		Cards.use_color = color

	def _getRank(self):
		return Cards.ranks[randrange(0, len(Cards.ranks))]

	def _getSuit(self):
		return Cards.suits[randrange(0, len(Cards.suits))]

	def _getCard(self):
		return '{0} {1}'.format(self._getRank(), self._getSuit())

	def shuffle(self):
		Cards.index = -1
		Cards.deck = []
		Cards.played = []
		while(True):
			card = self._getCard()
			if not card in Cards.deck:
				Cards.deck.append(card)
				if len(Cards.deck) == Cards.deck_num: 
					break
	
	def sort(self):
		Cards.sorted_hearts = []
		Cards.sorted_diamonds = []
		Cards.sorted_clubs = []
		Cards.sorted_spades = []
		for card in Cards.deck:
			rs = card.split(' ')
			num = 0
			if rs[0] == 'A': num = 1
			elif rs[0] == 'J': num = 11
			elif rs[0] == 'Q': num = 12
			elif rs[0] == 'K': num = 13
			else: num = int(rs[0])
			if rs[1] == '♥': # Hearts
				if rs[0] in Cards.sorted_hearts:
					pass
				else:
					Cards.sorted_hearts.append(num)
			elif rs[1] == '♦': # Diamonds
				if rs[0] in Cards.sorted_diamonds:
					pass
				else:
					Cards.sorted_diamonds.append(num)
			elif rs[1] == '♣': # Clubs
				if rs[0] in Cards.sorted_clubs:
					pass
				else:
					Cards.sorted_clubs.append(num)
			elif rs[1] == '♠': # Spades
				if rs[0] in Cards.sorted_spades:
					pass
				else:
					Cards.sorted_spades.append(num)

		Cards.sorted_hearts.sort()
		Cards.sorted_diamonds.sort()
		Cards.sorted_clubs.sort()
		Cards.sorted_spades.sort()

		hearts = ''
		for heart in Cards.sorted_hearts:
			if heart == 1: heart = 'A'
			elif heart == 11: heart = 'J'
			elif heart == 12: heart = 'Q'
			elif heart == 13: heart = 'K'
			hearts += '[' + str(heart) + _colored('♥', 'red') + ']'

		diamonds = ''
		for diamond in Cards.sorted_diamonds:
			if diamond == 1: diamond = 'A'
			elif diamond == 11: diamond = 'J'
			elif diamond == 12: diamond = 'Q'
			elif diamond == 13: diamond = 'K'
			diamonds += '[' + str(diamond) + _colored('♦', 'red') + ']'

		clubs = ''
		for club in Cards.sorted_clubs:
			if club == 1: club = 'A'
			elif club == 11: club = 'J'
			elif club == 12: club = 'Q'
			elif club == 13: club = 'K'
			clubs += '[' + str(club) + _colored('♣', 'white') + ']'

		spades = ''
		for spade in Cards.sorted_spades:
			if spade == 1: spade = 'A'
			elif spade == 11: spade = 'J'
			elif spade == 12: spade = 'Q'
			elif spade == 13: spade = 'K'
			spades += '[' + str(spade) + _colored('♠', 'white') + ']'

		return 'Sorted cards:\n♥ {0}\n♦ {1}\n♣ {2}\n♠ {3}\n'.format(hearts, diamonds, clubs, spades)
	
	def draw(self):
		if len(Cards.played) == Cards.deck_num: Cards.index = 0
		elif Cards.index == -1: Cards.index = 0 
		Cards.played.append(Cards.deck[Cards.index])
		rs = Cards.deck[Cards.index].split(' ')
		suit = ''
		if rs[1] == '♥' or rs[1] == '♦': suit = _colored(rs[1], 'red')
		else: suit = _colored(rs[1], 'white')
		return '[{0}{1}]'.format(rs[0], suit)

	def getValue(self):
		rs = Cards.deck[Cards.index].split(' ')
		Cards.index = Cards.index + 1
		value = 0
		if rs[0] == 'A': 
			value = 1
		elif rs[0] == 'J' or rs[0] == 'Q' or rs[0] == 'K':
			value = 10	
		else:
			value = rs[0]
			
		return int(value)

	def getPlayed(self):
		return len(Cards.played)

	def drawAll(self):
		i = 1
		draws = ''
		while i < Cards.deck_num:
			draws += ' ' + self.draw()
			i = i + 1

		return draws

def _colored(message, color):
	if Cards.use_color:
		return colored(message, color)
	else:
		return message
