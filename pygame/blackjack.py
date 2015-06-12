"""
Blackjack [Pygame]

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

"""
import sys
import os
import time
import pygame
from pygame.locals import *
from termcolor import cprint
from cards import Cards
from card import Card
from player import Player
from dealer import Dealer

screen = None

class Blackjack:

	use_color = True
	playing = True
	continue_game = True

	def __init__(self):
		self.cards = Cards()
		self.player = Player()
		self.dealer = Dealer()

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
		self.cards = Cards()
		self.player = Player()
		self.dealer = Dealer()
		self.dealer.shuffle(self.cards)
		card1, card2 = self.player.receiveCards(self.dealer.deal(self.cards))	
		card3, card4 = Dealer.receiveCards()

		global screen
		cards_render = pygame.sprite.RenderPlain((card1,card2,card3,card4))
		cards_render.update()
		cards_render.draw(screen)
		pygame.display.flip()
			
		return self._continueGame()

	def showCards(self):

		global screen
		card1 = Dealer.revealFirstCard()
		cards_render = pygame.sprite.RenderPlain((card1))
		cards_render.update()
		cards_render.draw(screen)
		pygame.display.flip()

		time.sleep(2)
		ds = self.dealer.showCards()
		time.sleep(2)
		ps = self.player.showCards()
		time.sleep(2)
		_print('---------------------------------------', 'magenta')
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
		_print('---------------------------------------', 'magenta')

	def hit(self):
		self.player.hit(self.cards)

	def stand(self):
		self.player.stand()
		response, dealer_cards = self.dealer.respond(self.cards)

		if len(dealer_cards) > 0:
			global screen
			card1 = dealer_cards[0]
			card2 = None
			cards_render = pygame.sprite.RenderPlain((card1))
			cards_render.update()
			cards_render.draw(screen)
			pygame.display.flip()

	def cls(self):
		os.system('cls' if os.name == 'nt' else 'clear')

def _print(message, color):
	if Blackjack.use_color and color != '':
		cprint(message, color)
	else:
		print(message)

def main():
	try:
		if not pygame.font:
			_print('Warning: Fonts disabled.', 'red')
		if not pygame.mixer:
			_print('Warning: Sounds disabled.', 'red')

		pygame.init()
		global screen
		screen = pygame.display.set_mode((750, 500))
		pygame.display.set_caption('Blackjack')
		pygame.mouse.set_visible(0)

		background = pygame.Surface(screen.get_size())
		background = background.convert()
		background.fill((0, 153, 0, 0))

		screen.blit(background, (0, 0))
		pygame.display.flip()
		
		dealer_pile = Card('bc.png', 10, 10)
		dealer_render = pygame.sprite.RenderPlain((dealer_pile))
		dealer_render.update()
		screen.blit(background, (0, 0))
		dealer_render.draw(screen)
		pygame.display.flip()

		while Blackjack.playing:

			game = Blackjack()
			game.cls()
			Blackjack.continue_game = game.new()

			while Blackjack.continue_game:
				if game.isBust(): break
				events = pygame.event.get()
				for event in events:
					if event.type == pygame.KEYDOWN:
						if event.key == pygame.K_h:
							game.hit()
						elif event.key == pygame.K_s:
							game.stand()
							Blackjack.continue_game = False

			game.showCards()
			time.sleep(5)
		
		print('\nExiting game...')
		sys.exit(0)

	except KeyboardInterrupt:
		print('\nExiting game...')
		sys.exit(0)

main()
