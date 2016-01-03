/*
	Blackjack

	Copyright 2016 Sam Saint-Pettersen
	Released under the MIT/X11 License.
*/

package main

import (
	"fmt"
	"math/rand"
	"time"
)

func contains(ap []string, v string) bool {
	t := false
	for _, a := range ap {
		if a == v {
			t = true
		}
	}
	return t
}

type Cards struct {
	index int
	deck []string
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
	deckNum := 52
	return Cards {
		index: -1,
		deckNum: deckNum,
		deck: make([]string, 0),
		played: make([]string, 0),
		sortedHearts: make([]string, deckNum / 4),
		sortedDiamonds: make([]string, deckNum / 4),
		sortedClubs: make([]string, deckNum / 4),
		sortedSpades: make([]string, deckNum / 4),
		ranks: []string {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"},
		suits: []string {"h", "d", "c", "s"},
	};
}

func (c Cards) _getRank() string {
	return c.ranks[rand.Intn(len(c.ranks) - 1)]
}

func (c Cards) _getSuit() string {
	return c.suits[rand.Intn(len(c.suits) - 1)]
}

func (c Cards) _getCard() string {
	rand.Seed(int64(time.Now().Nanosecond()))
	return fmt.Sprintf("%s %s", c._getRank(), c._getSuit())
}

func (c Cards) shuffle() Cards {
	for {
		card := c._getCard()
		if !contains(c.deck, card) {
			c.deck = append(c.deck, card)
		}
		if len(c.deck) == 30 {
			break
		}
	}
	return c
}

func (c Cards) draw() (Cards, string) {
	if len(c.played) == c.deckNum || c.index == -1 {
		c.index = 0
	}
	c.played = append(c.played, c.deck[c.index])

	return c, "foo"
}

func main() {

	var drawn string

	cards := newCards()
	cards = cards.shuffle()
	cards, drawn = cards.draw()
	fmt.Println(drawn)
}
