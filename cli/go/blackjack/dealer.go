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
	"sort"
)

type Dealer struct {
	cards []string
	values []int
}

func newDealer() Dealer {
	return Dealer {
		cards: make([]string, 0),
		values: make([]int, 0),
	}
}

func (d Dealer) _CalcTotal() int {
	sort.Sort(sort.Reverse(sort.IntSlice(d.values)))
	total := 0
	for _, v := range d.values {
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

func (d Dealer) _HasBlackjack() bool {
	blackjack := false
	if d._CalcTotal() == 21 {
		fmt.Println("\nPlayer has Blackjack!")
		blackjack = true
	}
	return blackjack
}

func (d Dealer) _IsBust() bool {
	bust := false
	if d._CalcTotal() > 21 {
		fmt.Println("\nPlayer is bust!")
		bust = true
	}
	return bust
}

func (d Dealer) _Hit(cards Cards) (Cards, Dealer) {
	cards, card := cards.Draw()
	d.cards = append(d.cards, card)
	fmt.Println("Dealer hits.")
	fmt.Println("Dealer gets", card)
	cards, value := cards.GetValue()
	d.values = append(d.values, value)
	fmt.Println("Player has", d._CalcTotal())
	return cards, d
}

func (d Dealer) _Stand() {
	fmt.Println("Player stands.")
	fmt.Println("Player has", d._CalcTotal())
}

func (d Dealer) Shuffle(cards Cards) Cards {
	if cards.GetPlayed() == 0 || cards.GetPlayed() >= 45 {
		fmt.Println("-------------------------------------------------------")
		fmt.Println("Dealer is shuffling cards...")
		fmt.Println("-------------------------------------------------------")
		cards.Shuffle()
	}
	return cards
}

func (d Dealer) Deal(cards Cards) (Cards, []string) {
	dealt := make([]string, 0)
	fmt.Println("-------------------------------------------------------")
	fmt.Println("Dealer is dealing cards for a new game...")
	fmt.Println("-------------------------------------------------------")
	for i := 0; i < 2 * 2; i++ {
		cards, card := cards.Draw()
		cards, value := cards.GetValue()
		dealt = append(dealt, fmt.Sprintf("%s%s", card, value))
	}
	for i := 0; i < 2; i++ {
		cv := strings.Split(dealt[i], ":")
		d.cards = append(d.cards, cv[0])
		value, _ := strconv.Atoi(cv[1])
		d.values = append(d.values, value)
	}
	fmt.Println("\nDealer has:")
	fmt.Println(fmt.Sprintf("[**]%s", d.cards[1]))
	return cards, dealt[2:]
}

func (d Dealer) Respond(cards Cards) (Cards, Dealer) {
	d.ShowCards()
	for {
		total := 0
		for total <= 18 {
			total = d._CalcTotal()
			if total == 16 {
				rand.Seed(int64(time.Now().Nanosecond()))
				if rand.Intn(6) >= 3 {
					cards, d = d._Hit(cards)
				} else {
					d._Stand()
					break
				}
			} else if total >= 17 {
				d._Stand()
				break
			} else {
				cards, d = d._Hit(cards)
			}
		}
	}
	return cards, d
}

func (d Dealer) ShowCards() int {
	cards := ""
	for _, card := range d.cards {
		cards = fmt.Sprintf("%s%s", cards, card)
	}
	fmt.Println("\nDealer has:")
	fmt.Println(fmt.Sprintf("%s --> %d", cards, d._CalcTotal()))
	return d._CalcTotal()
}
