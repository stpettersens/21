import sys
import pygame
from pygame.locals import *
from cards import Cards
from card import Card

if not pygame.font:
	_print('Warning: Fonts disabled.', 'red')
if not pygame.mixer:
	_print('Warning: Sounds disabled.', 'red')

pygame.init()
screen = pygame.display.set_mode((700, 500))
pygame.display.set_caption('Blackjack')
pygame.mouse.set_visible(0)

background = pygame.Surface(screen.get_size())
background = background.convert()
background.fill((0,153,0,0))

screen.blit(background, (0,0))
pygame.display.flip()

clock = pygame.time.Clock()
c = Cards()
c.shuffle()
print(c.draw())
card1 = Card(c.display(), 315, 10)
print(c.getValue())
v = c.draw()
v = c.display()
card2 = Card('bc.png', 225, 10)
print(c.getValue())
print(c.draw())
card3 = Card(c.display(), 225, 350)
print(c.getValue())
print(c.draw())
card4 = Card(c.display(), 315, 350)
print(c.getValue())

allsprites = pygame.sprite.RenderPlain((card1, card2, card3, card4))

while True:
	clock.tick(60)

	screen.blit(background, (0,0))
	allsprites.draw(screen)	
	pygame.display.flip()
	for arg in sys.argv:
		if arg == 'f': card2.change(v)
	allsprites.update()

