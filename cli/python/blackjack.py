"""
Blackjack

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

"""
import sys
import os
import time
import xml.etree.ElementTree as ET
from termcolor import cprint
from cards import Cards
from ai import AI
from player import Player
from dealer import Dealer

class Blackjack:

	use_ai = False
	settings = { 'use_color': True, 'code-page': '850' }
	playing = True
	continue_game = True

	@staticmethod
	def loadConfiguration(config='blackjack.xml'):
		tree = ET.parse(config)
		root = tree.getroot()
		for child in root.findall('terminal'):
			Blackjack.settings['use_color'] = str2bool(child.find('use-color').text)
			Blackjack.settings['code-page'] = child.find('code-page').get('default')

	def __init__(self):
		self.cards = Cards(Blackjack.settings['use_color'])
		self.player = Player(Blackjack.settings['use_color'])
		self.dealer = Dealer(Blackjack.settings['use_color'])

	def _continueGame(self):
		if self.player.hasBlackjack() or self.dealer.hasBlackjack():
			return False
		else:
			return True

	def isBust(self):
		if self.player.isBust() or self.dealer.isBust():
			return True
		else:
			return False
	
	def new(self):
		time.sleep(2)
		self.cards = Cards(Blackjack.settings['use_color'])

		if Blackjack.use_ai:
			self.player = AI(Blackjack.settings['use_color'])
		else:
			self.player = Player(Blackjack.settings['use_color'])

		self.dealer = Dealer(Blackjack.settings['use_color'])
		self.dealer.shuffle(self.cards)
		self.player.receiveCards(self.dealer.deal(self.cards))	
		return self._continueGame()	

	def showCards(self):
		time.sleep(2)
		ds = self.dealer.showCards()
		time.sleep(2)
		ps = self.player.showCards()
		time.sleep(2)
		_print('-------------------------------------------------------', 'magenta')
		if ps == ds or (ps > 21 and ds > 21):
			_print('Push. Neither dealer nor player won.', 'magenta')

		elif ps <= 21 and ps > ds:
			_print('Player wins with {0}.'.format(ps), 'magenta')

		elif ds <= 21 and ds > ps:
			_print('Dealer wins with {0}.'.format(ds), 'magenta')

		elif ps > 21 and ds <= 21:
			_print('Dealer wins with {0}. Player bust.'.format(ds), 'magenta')
		elif ds > 21 and ps <= 21:
			_print('Player wins with {0}. Dealer bust.'.format(ps), 'magenta')
		_print('-------------------------------------------------------', 'magenta')

	def hit(self):
		self.player.hit(self.cards)

	def stand(self):
		self.player.stand()
		self.dealer.respond(self.cards)

	def aiRespond(self):
		response = self.player.respond(self.cards)
		if response == 'stand':
			response = self.dealer.respond(self.cards)
			if response == 'stand':
				Blackjack.continue_game = False

	def cls(self):
		os.system('cls' if os.name == 'nt' else 'clear')

def _print(message, color):
	if Blackjack.settings['use_color'] and color != '':
		cprint(message, color)
	else:
		print(message)

def resetCodePage():
	if os.name == 'nt':
		os.system('chcp ' + Blackjack.settings['code-page'])

def str2bool(value):
	return value.lower() in ( "true", "1" )

def main(args):
	for arg in args:
		if arg == '--ai':
			Blackjack.use_ai = True
	try:
		Blackjack.loadConfiguration()
		while Blackjack.playing:
			game = Blackjack()
			game.cls()
			Blackjack.continue_game = game.new()
			while Blackjack.continue_game:
				if game.isBust(): break
				if not Blackjack.use_ai:
					choice = raw_input('Hit [H] or Stand [S]: ')
					if choice.upper() == 'H':
						game.hit()
	
					elif choice.upper() == 'S':
						game.stand()
						Blackjack.continue_game = False
					else:
						print('Invalid option, assuming stand.')
						game.stand()
						Blackjack.continue_game = False
				else:
					game.aiRespond()

			game.showCards()

			if not Blackjack.use_ai:
				play_again = raw_input('Play again? [Y/N]: ')
				if play_again.upper() == 'N':
					Blackjack.playing = False
				elif play_again.upper() == 'Y':
					pass
				else:
					Blackjack.playing = False
					print('Invalid option...')
			else:
				time.sleep(3)

	except KeyboardInterrupt:
		pass
		
	print('\nExiting game...')
	resetCodePage()
	sys.exit(0)

main(sys.argv[1:])
