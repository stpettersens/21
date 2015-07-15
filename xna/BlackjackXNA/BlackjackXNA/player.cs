/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/

class Player {
  private bool debug;
  private int index;
  private int pos;
  private List<string> cards;
  private List<int> values;

  public Player(bool debug) {
    this.debug = debug;
    this.index = -1;
    this.pos = 225;
    this.cards = new List<string>();
    this.values = new List<int>();
  }

  public int CalcTotal() {
    this.values = this.values.OrderByDescending().toList();
    int total = 0;
    for(int i = 0; i < this.values.Count; i++) {
      int v = this.values[i];
      if(v == 1) {
        if((total + 11) <= 21) v = 11;
        if((total + 11) > 21) v = 1;
      }
      total += v;
    }
    return total;
  }

  public bool HasBlackjack() {
    bool blackjack = false;
    if(this.CalcTotal() == 21) {
      Debug.Print(this.debug, "Player has Blackjack!");
      blackjack = true;
    }
    return blackjack;
  }

  public bool IsBust() {
    bool bust = false;
    if(this.CalcTotal() > 21) {
      Debug.Print(this.debug, "Player is bust!");
      bust = true;
    }
    return bust;
  }

  public Card[] ReceiveCards(List<string> player_cards) {
    string pc = "";
    for(int i = 0; i < player_cards.Count; i++) {
      string[] cv = player_cards[i].split(":");
      this.cards.Add(cv[0]);
      this.values.Add(int.Parse(cv[1]));
    }
    pc = this.cards[0] + this.cards[1];
    Debug.Print(this.debug, "\nPlayer receives their cards:");
    Debug.Print(this.debug, "%s --> %d", pc, this.CalcTotal());

    this.index++;
    Card cardA = new Card(Card.getImage(this.cards[this.index]), this.pos, 310);
    this.pos += 90;
    ths.index++;
    Card cardB = new Card(Card.getImage(this.cards[this.index]), this.pos, 310);
    return new Array<Card> { cardA, cardB };
  }

  public Card Hit(Cards cards) {
    string card = cards.Draw();
    this.cards.Add(card);
    this.values.Add(cards.GetValue());
    this.index++;
    this.pos += 90;
    Debug.Print(this.debug, "Player hits.");
    Debug.Print(this.debug, "Players gets " + card);
    Debug.Print(this.debug, String.Format("Player has %d", this.CalcTotal()));
    return new Card(); // TODO
  }

  public void Stand() {
    Debug.Print(this.debug, "Player stands.");
    Debug.Print(this.debug, String.Format("Player has %d", this.CalcTotal()));
  }

  public int ShowCards() {
    this.index = 0;
    this.pos = 225;
    string card = "";
    for(int i = 0; i < this.cards.Count; i++) {
      cards += this.cards[i];
    }
    Debug.Print(this.debug, "\nPlayer has:");
    Debug.Print(this.debug, String.Format("%s --> %d", this.CalcTotal()));
    return this.CalcTotal();
  }
}