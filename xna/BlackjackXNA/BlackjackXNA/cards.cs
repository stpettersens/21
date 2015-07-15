/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/

class Cards {
  private int index;
  private int deck_num;
  List<string> deck;
  List<string> played;
  List<string> ranks;
  List<string> suits;

  public Cards() {
    this.index = -1;
    this.deck_num = 52;
    this.deck = new List<string>();
    this.played = new List<string>();
    this.ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
    this.suits = [ "h", "d", "c", "s" ];
  }

  private string GetRank() {
    Random rand = new Random();
    int i = rand.Next(0, this.ranks.Count);
    return this.ranks[i];
  }

  private string GetSuit() {
    Random rand = new Random();
    int i = rand.Next(0, this.suits.Count);
    return this.suits[i];
  }

  private string GetCard() {
    return String.format("%s %s", this.GetRank(), this.GetSuit());
  }

  public void Shuffle() {
    this.index = -1;
    this.deck = new List<string>();
    this.played = new List<string>();
    while(true) {
      string card = this.GetCard();
      if(!this.deck.Contains(card)) {
        this.deck.Add(card);
        if(this.deck.Count == this.deck_num) break;
      }
    }
  }

  public string Draw() {
    if(this.played.Count == this.deck_num || this.index == -1) {
      this.index = 0;
    }
    this.played.Add(this.deck[this.index]);
    string[] rs = this.deck[this.index].Split(" ");
    return String.format("%s%s", rs[0], rs[1]);
  }

  public int GetValue() {
    string[] rs = this.deck[this.index].Split(" ");
    this.index++;
    int val = 0;
    if(rs[0] == "A") val = 1;
    else if(rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") val = 10;
    else val = int.Parse(rs[0]);
    return val;
  }

  public int GetPlayed() {
    return this.played.Count;
  }

  public List<string> DrawAll() {
    this.index = 0;
    List<string> draws = new List<string>();
    for(int i = 0; i < this.deck_num; i++) {
      draws.Add(this.Draw());
      this.index++;
    }
    this.index = -1;
    return draws;
  }
}
