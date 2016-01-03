/*
	Blackjack

	Copyright 2016 Sam Saint-Pettersen
	Released under the MIT/X11 License.
*/

package main

import (
	"fmt"
)

func main() {

	cards := newCards()
	cards = cards.Shuffle()

	player := newPlayer()
	dealer := newDealer()

	fmt.Println(player.cards)
	fmt.Println(dealer.cards)
}
