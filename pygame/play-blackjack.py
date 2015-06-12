"""
Blackjack

Copyright 2015 Sam Saint-Pettersen
Released under the MIT/X11 License.

"""
import sys
import os
import xml.etree.ElementTree as ET

if os.name == 'nt':
	tree = ET.parse('blackjack.xml')
	root = tree.getroot()
	codepage = None
	for child in root.findall('terminal'):
		codepage = child.find('code-page').get('use')

	os.system('chcp ' + codepage)

try:
	args = ''
	for arg in sys.argv:
		args += ' ' + arg
	os.system('python blackjack.py ' + args)

except KeyboardInterrupt:
	pass
