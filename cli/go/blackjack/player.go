/*
	Blackjack

	Copyright 2016 Sam Saint-Pettersen
	Released under the MIT/X11 License.
*/

package main

import (
	"fmt"
	"strings"
	"strconv"
	"sort"
)

type Player struct {
	cards []string
	values []int
}

func newPlayer() Player {
	return Player {
		cards: make([]string, 0),
		values: make([]int, 0),
	}
}

func (p Player) CalcTotal() int {
	sort.Sort(sort.Reverse(sort.IntSlice(p.values)))
	total := 0
	for _, v := range p.values {
		if v == 1 {
			if total + 11 <= 21 {
				v = 11
			} else {
				v = 1
			}
		}
		total += v
	}
	return total
}

func (p Player) HasBlackjack() bool {
	blackjack := false
	if p.CalcTotal() == 21 {
		fmt.Println("\nPlayer has Blackjack!")
		blackjack = true
	}
	return blackjack
}

func (p Player) IsBust() bool {
	bust := false
	if p.CalcTotal() > 21 {
		fmt.Println("\nPlayer is bust!")
		bust = true
	}
	return bust
}

func (p Player) ReceiveCards(playerCards []string) Player {
	cards := ""
	for _, card := range playerCards {
		cv := strings.Split(card, ":")
		p.cards = append(p.cards, cv[0])
		value, _ := strconv.Atoi(cv[1])
		p.values = append(p.values, value)
	}
	cards = fmt.Sprintf("%s%s", p.cards[0], p.cards[1])
	fmt.Println("Player receives their cards:")
	fmt.Println(fmt.Sprintf("%s --> %d", cards, p.CalcTotal()))
	return p
}

func (p Player) Hit(cards Cards) (Cards, Player) {
	cards, card := cards.Draw()
	p.cards = append(p.cards, card)
	fmt.Println("Player hits.")
	fmt.Println("Player gets", card)
	cards, value := cards.GetValue()
	p.values = append(p.values, value)
	fmt.Println("Player has", p.CalcTotal())
	return cards, p
}

func (p Player) Stand() {
	fmt.Println("Player stands.")
	fmt.Println("Player has", p.CalcTotal())
}

func (p Player) ShowCards() int {
	cards := ""
	for _, card := range p.cards {
		cards = fmt.Sprintf("%s%s", cards, card)
	}
	fmt.Println("\nPlayer has:")
	fmt.Println(fmt.Sprintf("%s --> %d", cards, p.CalcTotal()))
	return p.CalcTotal()
}
