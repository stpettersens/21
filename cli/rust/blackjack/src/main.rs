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

fn main() {

	let dealer = Dealer::new();
	let player = Player::new();
	let mut cards = Cards::new();
    cards.shuffle();
    println!("{} ({})", cards.draw(), cards.get_value());

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
