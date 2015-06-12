# -*- coding: utf-8 -*-
"""
Blackjack [Pygame]

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

Card class
"""
import re
import os
import pygame
from pygame.locals import *

class Card(pygame.sprite.Sprite):

	@staticmethod
	def getImage(card):
		suit = ''
		s = re.search('♥', card)
		suit = 'h'
		if s == None:
			s = re.search('♦', card)
			suit = 'd'
			if s == None:
				s = re.search('♣', card)
				suit = 'c'
				if s == None:
					suit = 's'
				else:
					suit = 'b'
	
		r = re.search('(\d{1,2}|A|J|Q|K)', card)
		rank = None
		if r == None:
			rank = 'c'
		else:
			rank = str(r.group(0))

		return suit + rank + '.png'

	def _loadImage(self, name, colorkey=None):
		fullname = os.path.join('gfx', name)
		try:
			image = pygame.image.load(fullname)

		except pygame.error, message:
			print('Cannot load image: ' + name)
			raise SystemExit, message

		image = image.convert()
		if colorkey is not None:
			if colorkey is -1:
				colorkey = image.get_at((0,0))
			image.set_colorkey(colorkey, RLEACCEL)
	
		return image, image.get_rect()
	
	def __init__(self, card, pos_x, pos_y):
		self.card = card
		self.pos_x = pos_x
		self.pos_y = pos_y
		pygame.sprite.Sprite.__init__(self)
		self.image, self.rect = self._loadImage(card)
		screen = pygame.display.get_surface()
		self.area = screen.get_rect()
		self.rect.topleft = pos_x, pos_y

	def change(self, card):
		self.image, self.rect = self._loadImage(card)	

	def update(self):
		screen = pygame.display.get_surface()
		self.area = screen.get_rect()
		self.rect.topleft = self.pos_x, self.pos_y
		
