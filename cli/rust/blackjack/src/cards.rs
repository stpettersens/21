/*
	Blackjack

	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License
*/

extern crate rand;
use self::rand::Rng;

/// Blackjack Cards.
pub struct Cards {
	index: usize,
    deck: Vec<String>,
    played: Vec<String>,
    sorted_hearts: Vec<u16>,
    sorted_diamonds: Vec<u16>,
    sorted_clubs: Vec<u16>,
    sorted_spades: Vec<u16>,
    deck_num: usize,
    ranks: Vec<String>,
    suits: Vec<String>,
}

impl Cards {

	pub fn new() -> Cards {
		Cards {
            index: 0,
            deck: Vec::new(),
            played: Vec::new(),
            sorted_hearts: Vec::new(),
            sorted_diamonds: Vec::new(),
            sorted_clubs: Vec::new(),
            sorted_spades: Vec::new(),
			ranks: vec![
            "A".to_string(), "2".to_string(), "3".to_string(),
            "4".to_string(), "5".to_string(), "6".to_string(), 
            "7".to_string(), "8".to_string(), "9".to_string(), 
            "10".to_string(), "J".to_string(), "Q".to_string(), "K".to_string()],
            suits: vec![
            "h".to_string(), "d".to_string(), "c".to_string(), "s".to_string()
            ],
            deck_num: 52,
		}
	}

    fn get_rank(&self) -> String {
        let rank = self.ranks[rand::thread_rng().gen_range(0, self.ranks.len())].clone();
        rank
    }

    fn get_suit(&self) -> String {
        let suit = self.suits[rand::thread_rng().gen_range(0, self.suits.len())].clone();
        suit
    }

    fn get_card(&self) -> String {
        let card = format!("{} {}", self.get_rank(), self.get_suit());
        card
    }

    fn get_collection(&self, cards: Vec<u16>, sym: &str) -> String {
        let mut collection = String::new();
        let mut c = String::new();
        for card in cards {
            if card == 1 {
                c = "A".to_string();
            }
            else if card == 11 {
                c = "J".to_string();
            }
            else if card == 12 {
                c = "Q".to_string();
            }
            else if card == 13 {
                c = "K".to_string();
            }
            else {
                let n = format!("{}", card);
                c = n.to_string();
            }
            collection = format!("{}{} ", collection, c);
        }
        collection = format!("{} {}", collection, sym);
        collection
    }

    pub fn shuffle(&mut self) {
        self.index = 0;
        self.deck = Vec::new();
        self.played = Vec::new();

        loop {
            let card = self.get_card();
            if !self.deck.contains(&card) {
                self.deck.push(card);
                if self.deck.len() == self.deck_num {
                    break;
                }
            }
        }
    }

    pub fn sort(&mut self) -> String {
        let deck = self.deck.clone();
        for card in deck {
            let rsv = card.split(" ");
            let rs: Vec<&str> = rsv.collect();
            let mut num: u16 = 0;
            if rs[0] == "A" {
                num = 1;
            }
            else if rs[0] == "J" {
                num = 11;
            }
            else if rs[0] == "Q" {
                num = 12;
            }
            else if rs[0] == "K" {
                num = 13;
            }
            else {
                let v = rs[0].parse::<u16>().ok();
                num = match v {
                    Some(num) => num,
                    None => 0
                };
            }

            if rs[1] == "h" {
                if !self.sorted_hearts.contains(&num) {
                    self.sorted_hearts.push(num);
                }
            }
            else if rs[1] == "d" {
                if !self.sorted_diamonds.contains(&num) {
                    self.sorted_diamonds.push(num);
                }
            }
            else if rs[1] == "c" {
                if !self.sorted_clubs.contains(&num) {
                    self.sorted_clubs.push(num);
                }
            }
            else if rs[1] == "s" {
                if !self.sorted_spades.contains(&num) {
                    self.sorted_spades.push(num);
                }
            }
        }

        self.sorted_hearts.sort();
        self.sorted_diamonds.sort();
        self.sorted_clubs.sort();
        self.sorted_spades.sort();

        let hearts = self.get_collection(self.sorted_hearts.clone(), "h");
        let diamonds = self.get_collection(self.sorted_diamonds.clone(), "d");
        let clubs = self.get_collection(self.sorted_clubs.clone(), "c");
        let spades = self.get_collection(self.sorted_spades.clone(), "s");
        let sorted = format!("Sorted cards:\n{}\n{}\n{}\n{}", hearts, diamonds, clubs, spades);
        sorted
    }

    pub fn draw(&mut self) -> String {
        self.played.push(self.deck[self.index].clone());
        let rsv = self.deck[self.index].split(" ");
        let rs: Vec<&str> = rsv.collect();
        let drawn = format!("[{}{}]", rs[0], rs[1]);
        drawn.to_string()
    }

    pub fn get_value(&mut self) -> u16 {
        let rsv = self.deck[self.index].split(" ");
        let rs: Vec<&str> = rsv.collect();
        self.index += 1;
        let mut value = 0;
        if rs[0] == "A" {
            value = 1
        }
        else if rs[0] == "J" || rs[0] == "Q" || rs[0] == "K" {
            value = 10
        }
        else {
            let v = rs[0].parse::<u16>().ok();
            value = match v {
                Some(value) => value,
                None => 0
            };
        }
        value
    }

    pub fn get_played(&self) -> usize {
        self.played.len()
    }

    pub fn draw_all(&mut self) -> String {
        let mut draws = String::new();
        for i in 0..self.deck_num {
            draws = format!("{}{}", draws, self.draw());
            let _v = self.get_value();
        }
        draws.to_string()
    }
}
