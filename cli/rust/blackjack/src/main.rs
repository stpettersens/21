/*
	Blackjack

	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License
*/

mod cards;
mod dealer;
mod player;

use std::io;

use cards::Cards;
use dealer::Dealer;
use player::Player;

fn continue_game(ref player: Player, ref dealer: Dealer) -> bool {
    let mut cont = true;
    if player.has_blackjack() || dealer.has_blackjack() {
        cont = false;
    }
    cont
}

fn is_bust(ref player: Player, ref dealer: Dealer) -> bool {
    let mut bust = false;
    if player.is_bust() || dealer.is_bust() {
        bust = true
    }
    bust
}

fn show_cards(player: Player, dealer: Dealer) {
    let ds = dealer.show_cards();
    let ps = player.show_cards();
    println!("-----------------------------------------------");
    if ps == ds || (ps > 21 && ds > 21) {
        println!("Push. Neither dealer nor player won.");
    }
    else if ps <= 21 && ps > ds {
        println!("Player wins with {}.", ps);
    }
    else if ps <= 21 && ds > ps {
        println!("Dealer wins with {}.", ds);
    }
    else if ps > 21 && ds <= 21 {
        println!("Dealer wins with {}. Player bust.", ds);
    }
    else if ds > 21 && ps <= 21 {
        println!("Player wins with {}. Dealer bust.", ps);
    }
    println!("-----------------------------------------------");
}

fn hit(player: Player, cards: Cards) {
    //player.hit(cards);
}

fn stand(player: Player, dealer: Dealer, cards: Cards) {
    player.stand();
    //dealer.respond(cards);
}

fn cls() {

}

fn main() {

	let dealer = Dealer::new();
	let player = Player::new();
	let mut cards = Cards::new();

    loop {
        
        let mut action = String::new();
        io::stdin().read_line(&mut action)
        .ok()
        .expect("Failed to read line");

	    let action: String = match action.trim().parse() {
	    	Ok(a) => a,
	    	Err(_) => continue,
	    };

	    if action == "q" {
            println!("Quiting...");
	        break;
	    }
	}
}
