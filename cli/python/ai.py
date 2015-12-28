"""
Blackjack

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

AI class
"""
import time
from random import randrange
from termcolor import cprint

class AI:

	use_color = True
	cards = []
	values = []

	def __init__(self, color):
		AI.use_color = color
		AI.cards = []
		AI.values = []

	def calcTotal(self):
		AI.values.sort(reverse=True)
		total = 0
		for v in AI.values:
			if v == 1:
				if total + 11 <= 21: v = 11
				elif total + 11 > 21: v = 1
			total += v
		return total

	def hasBlackjack(self):
		blackjack = False
		if self.calcTotal() == 21:
			_print('\nAI has Blackjack!', 'magenta')
			blackjack = True

		return blackjack

	def isBust(self):
		bust = False
		if self.calcTotal() > 21:
			_print('\nAI is bust!', 'magenta')
			bust = True
		
		return bust
		
	def receiveCards(self, player_cards):
		cards = ''
		for card in player_cards:
			cv = card.split(':')
			AI.cards.append(cv[0])
			AI.values.append(int(cv[1]))
		
		cards += AI.cards[0] + AI.cards[1]

	def _hit(self, cards):
		card = cards.draw()
		AI.cards.append(card)
		_print('AI hits.', 'magenta')
		_print('AI gets ' + card, 'magenta')
		AI.values.append(cards.getValue())

	def _stand(self):
		_print('AI stands.', 'magenta')

	def respond(self, cards):
		time.sleep(1)
		self.showCards()
		responding = True
		while responding:
			total = 0
			while total <= 18:
				total = self.calcTotal()
				time.sleep(2)
				if total == 16:
					if randrange(0, 5) >= 3:
						self._hit(cards) # Take risk.
					else:
						self._stand() # Play it safe.
						responding = False
						break
				elif total >= 17:
					self._stand()
					responding = False
					break
				else:
					self._hit(cards)

		return 'stand'		

	def showCards(self):
		cards = ''
		for card in AI.cards:
			cards += card

		_print('\nAI has:', 'magenta')
		_print('{0} --> {1}'.format(cards, self.calcTotal()), '')
		return self.calcTotal()

def _print(message, color):
	if AI.use_color and color != '':
		cprint(message, color)
	else:
		print(message)
