/*
	Blackjack

	Copyright 2016 Sam Saint-Pettersen
	Released under the MIT/X11 License.
*/

package main

type Cards struct {
	index int
	deck []int
	played []string
	sortedHearts []string
	sortedDiamonds []string
	sortedClubs []string
	sortedSpades []string
	deckNum int
	ranks []string
	suits []string
}

func newCards() Cards {
	return Cards {
		index: -1,
		deckNum: 52,
		deck: make([]string, deckNum, deckNum),
		played: make([]string, deckNum, deckNum),
		sortedHearts: make([]string, deckNum / 4, deckNum / 4),
		sortedDiamonds: make([]string, deckNum / 4, deckNum / 4),
		sortedClubs: make([]string, deckNum / 4, deckNum / 4),
		sortedSpades: make([]string, deckNum / 4, deckNum / 4),
		ranks: [],
		suits: [],
	}
}

func (c Cards) _getRank() {
	return c.ranks[0];
}

func (c Cards) _getSuit() {
	return c.suits[0];
}

func (c Cards) _getCard() {
	return "foo";
}

func (c Cards) shuffle() {
	
}
