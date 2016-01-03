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
	"strings"
	"strconv"
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
		index: 0,
		deckNum: deckNum,
		deck: make([]string, 0),
		played: make([]string, 0),
		sortedHearts: make([]string, deckNum / 4),
		sortedDiamonds: make([]string, deckNum / 4),
		sortedClubs: make([]string, deckNum / 4),
		sortedSpades: make([]string, deckNum / 4),
		ranks: []string {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"},
		suits: []string {"h", "d", "c", "s"},
	}
}

func (c Cards) _GetRank() string {
	return c.ranks[rand.Intn(len(c.ranks) - 1)]
}

func (c Cards) _GetSuit() string {
	return c.suits[rand.Intn(len(c.suits) - 1)]
}

func (c Cards) _GetCard() string {
	rand.Seed(int64(time.Now().Nanosecond()))
	return fmt.Sprintf("%s %s", c._GetRank(), c._GetSuit())
}

func (c Cards) Shuffle() Cards {
	for {
		card := c._GetCard()
		if !contains(c.deck, card) {
			c.deck = append(c.deck, card)
		}
		if len(c.deck) == 30 {
			break
		}
	}
	return c
}

func (c Cards) Draw() (Cards, string) {
	c.played = append(c.played, c.deck[c.index])
	rs := strings.Split(c.deck[c.index], " ")
	return c, fmt.Sprintf("[%s%s]", rs[0], rs[1])
}

func (c Cards) GetValue() (Cards, int) {
	rs := strings.Split(c.deck[c.index], " ")
	c.index += 1
	value := 0
	if rs[0] == "A" {
		value = 1
	} else if rs[0] == "J" || rs[0] == "Q" || rs[0] == "K" {
		value = 10
	} else {
		value, _ = strconv.Atoi(rs[0])
	}
	return c, value
}

func (c Cards) GetPlayed() int {
	return len(c.played)
}
