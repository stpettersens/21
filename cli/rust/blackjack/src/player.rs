/*
	Blackjack

	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License
*/

extern crate rand;
use self::rand::Rng;

/// Blackjack Player.
pub struct Player {
	cards: Vec<String>,
    values: Vec<u16>,
}

impl Player {

	pub fn new() -> Player {
		Player {
			cards: Vec::new(),
            values: Vec::new(),
		}
	}

    pub fn calc_total(&self) -> u16 {
        let mut values = self.values.clone();
        values.sort();
        values.reverse();
        let mut total: u16 = 0;
        for i in values {
            let mut v: u16 = 0;
            if i == 1 {
                if total + 11 <= 21 {
                    v = 11
                }
                else if total + 11 > 21 {
                    v = 1
                }
            }
            total += v;
        }
        total
    }

    pub fn has_blackjack(&self) -> bool {
        let mut blackjack = false;
        if self.calc_total() == 21 && self.cards.len() == 2{
            println!("Player has Blackjack!");
            blackjack = true
        }
        blackjack
    }

    pub fn is_bust(&self) -> bool {
        let mut bust = false;
        if self.calc_total() > 21 {
            println!("Player is bust!");
            bust = false
        }
        bust
    }

    fn process_cards(&mut self, cards: Vec<&str>) {
        let v = cards[1].parse::<u16>().ok();
        let value = match v {
            Some(v) => v,
            None => 0
        };
        self.cards.push(cards[0].to_string());
        self.values.push(value);
    }

    pub fn receive_cards(&mut self, player_cards: Vec<String>) {
        for card in player_cards {
            let cvs = card.split(":");
            let cv: Vec<&str> = cvs.collect();
            self.process_cards(cv);
        }
    }

    pub fn hit(&mut self, cards: u16) {
        let card = cards;//.draw();
        self.cards.push("foo".to_string());
        println!("Player hits.");
        println!("Player gets {}", card);
        self.values.push(card); //cards.getValue());
    }

    pub fn stand(&self) {
        println!("Player stands.");
    }

    pub fn respond(&mut self, cards: u16) {
        self.show_cards();
        loop {
            let mut total = 0;
            while total <= 18 {
                total = self.calc_total();
                if total == 16 {
                    if rand::thread_rng().gen_range(0, 5) >= 3 {
                        self.hit(cards); // Take risk.
                    }
                    else {
                        self.stand(); // Play it safe.
                        break;
                    }  
                }
                else if total >= 17 {
                    self.stand();
                    break;
                }
                else {
                    self.hit(cards);
                }
            }
        }
    }

    pub fn show_cards(&mut self) -> u16 {
        let mut cards = String::new();
        let vcards = self.cards.clone();
        for card in vcards {
            cards = format!("{}{}", cards, card);
        }
        println!("Player has:");
        println!("{} --> {}", cards, self.calc_total());
        self.calc_total()
    }
}
