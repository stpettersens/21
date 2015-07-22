/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;
using System.Collections.Generic;
using Helper;

namespace BlackjackXNA
{
  class Dealer 
  {
    private bool debug;
    private int index;
    private int pos;
    private List<string> cards;
    private List<int> values;
  
    public Dealer(bool debug) 
    {
      this.debug = debug;
      this.index = 0;
      this.pos = 225;
      this.cards = new List<string>();
      this.values = new List<int>();
    }
  
    public int CalcTotal() 
    {
      this.values.Sort(); //.OrderByDescending().toList();
      int total = 0;
      for(int i = 0; i < this.values.Count; i++) 
      {
        int v = this.values[i];
        if(v == 1) 
        {
          if((total + 11) <= 21) v = 11;
          else if((total + 11) > 21) v = 1;
        }
        total += v;
      }
      return total;
    }
  
    private Card Hit(Cards cards) 
    {
      this.index++;
      this.pos = 90;
      string card = cards.Draw();
      this.cards.Add(card);
      this.values.Add(cards.GetValue());
      Debugger.Emit(this.debug, "Dealer hits.");
      Debugger.Emit(this.debug, "Dealer gets " + card);
      return new Card(cards.GetCardImages(Card.GetImage(card)), this.pos, 10);
    }
  
    private void Stand() 
    {
      Debugger.Emit(this.debug, "Dealer stands.");
    }
  
    public void Shuffle(Cards cards)
    {
      if(cards.GetPlayed() == 0 || cards.GetPlayed() >= 45)
      {
        Debugger.Emit(this.debug, "----------------------------------------------------");
        Debugger.Emit(this.debug, "Dealer is shuffling cards....");
        Debugger.Emit(this.debug, "----------------------------------------------------");
        cards.Shuffle();
      }
    }
  
    public string[] Deal(Cards cards) 
    {
      List<string> dealt = new List<string>();
      int i = 1;
      Debugger.Emit(this.debug, "----------------------------------------------------");
      Debugger.Emit(this.debug, "Dealer is dealing cards for a new game...");
      Debugger.Emit(this.debug, "----------------------------------------------------");
      while(i <= (2 * 2)) 
      {
        dealt.Add(cards.Draw() + ":" + cards.GetValue());
        i++;
      }
      i = 0;
      while(i < 2) 
      {
        string[] cv = dealt[i].Split();
        this.cards.Add(cv[0]);
        this.values.Add(int.Parse(cv[1]));
        i++;
      }
      Debugger.Emit(this.debug, "\nDealer has:");
      Debugger.Emit(this.debug, "[**]" + this.cards[1]);
      return new string[] {dealt[2], dealt[3]};
    }
  
    public bool HasBlackjack() 
    {
      bool blackjack = false;
      if(this.CalcTotal() == 21) 
      {
        Debugger.Emit(this.debug, "Dealer has Blackjack!");
        blackjack = true;
      }
      return blackjack;
    }
  
    public bool IsBust() 
    {
      bool bust = false;
      if(this.CalcTotal() > 21)
      {
        Debugger.Emit(this.debug, "Dealer is bust!");
        bust = true;
      }
      return bust;
    }
  
    public List<Card> Respond(Cards cards) 
    {
      this.ShowCards();
      bool responding = true;
      List<Card> response_cards = new List<Card>();
      while(responding)
      {
        int total = 0;
        while(total <= 18) 
        {
          total = this.CalcTotal();
          if(total == 16)
          {
            Random rand = new Random();
            if(Math.Floor((double)rand.Next() * 6) >= 3) 
            {
              response_cards.Add(this.Hit(cards)); // Take risk.
            }
            else 
            {
              this.Stand(); // Play it safe.
            }
          }
          else if(total >= 17)
          {
            this.Stand();
            responding = false;
            break;
          }
          else
          {
            response_cards.Add(this.Hit(cards));
          }
        }
      }
      return response_cards;
    }
  
    public int ShowCards() 
    {
      this.index = 0;
      this.pos = 225;
      string cards = "";
      for(int i = 0; i < this.cards.Count; i++) 
      {
        cards += this.cards[i];
      }
      Debugger.Emit(this.debug, "\nDealer has:");
      Debugger.Emit(this.debug, String.Format("%s --> %d", cards, this.CalcTotal()));
      return this.CalcTotal();
    }
  
    public Card[] ReceiveCards(Cards cards) 
    {
      Card cardA = new Card(cards.GetCardImages(Card.GetImage("c")), this.pos, 10);
      this.pos += 90;
      Card cardB = new Card(cards.GetCardImages(Card.GetImage(this.cards[1])), this.pos, 10);
      this.index += 2;
      return new Card[] { cardA, cardB };
    }
  
    public Card RevealFirstCard() 
    {
        return null;
    }
  }
}
