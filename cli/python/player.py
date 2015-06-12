"""
Blackjack

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

Player class
"""
from termcolor import cprint

class Player:

	use_color = True
	cards = []
	values = []

	def __init__(self, color):
		Player.use_color = color
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
			_print('\nPlayer has Blackjack!', 'magenta')
			return True

	def isBust(self):
		if self.calcTotal() > 21:
			_print('\nPlayer is bust!', 'magenta')
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

	def hit(self, cards):
		card = cards.draw()
		Player.cards.append(card)
		_print('Player hits.', 'magenta')
		_print('Player gets ' + card, 'magenta')
		Player.values.append(cards.getValue())
		_print('Player has ' + str(self.calcTotal()), 'magenta')

	def stand(self):
		_print('Player stands.', 'magenta')
		_print('Player has ' + str(self.calcTotal()), 'magenta')

	def showCards(self):
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

