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
  /// <summary>
  /// Dealer implements the dealer for Blackjack.
  /// </summary>
  class Dealer 
  {
    private bool debug;
    private int index;
    private int pos;
    private List<string> cards;
    private List<int> values;
    private Cards gameCards;
  
    /// <summary>
    /// Constructor for dealer.
    /// </summary>
    /// <param name="debug">Enable debug messages?</param>
    /// <param name="gameCards">Game cards.</param>
    public Dealer(bool debug, Cards gameCards) 
    {
      this.debug = debug;
      this.index = 0;
      this.pos = 225;
      this.cards = new List<string>();
      this.values = new List<int>();
      this.gameCards = gameCards;
    }
  
    /// <summary>
    /// Calculate the total value of dealer's held cards.
    /// </summary>
    /// <returns>Total value of dealer's cards.</returns>
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
  
    /// <summary>
    /// Dealer hits.
    /// </summary>
    /// <param name="cards">Game cards.</param>
    /// <returns>Dealer's drawn card.</returns>
    private Card Hit(Cards cards) 
    {
      this.index++;
      this.pos = 90;
      string card = cards.Draw();
      this.cards.Add(card);
      this.values.Add(cards.GetValue());
      Debugger.Emit(this.debug, "Dealer hits.");
      Debugger.Emit(this.debug, "Dealer gets " + card);
      return new Card(cards.GetImage(card), this.pos, 10);
    }
  
    /// <summary>
    /// Dealer stands.
    /// </summary>
    private void Stand() 
    {
      Debugger.Emit(this.debug, "Dealer stands.");
    }
  
    /// <summary>
    /// Dealer shuffles.
    /// </summary>
    public void Shuffle()
    {
        Debugger.Emit(this.debug, "----------------------------------------------------");
        Debugger.Emit(this.debug, "Dealer is shuffling cards....");
        Debugger.Emit(this.debug, "----------------------------------------------------");
        this.gameCards.Shuffle();
    }
  
    /// <summary>
    /// Dealer deals.
    /// </summary>
    /// <param name="cards">Game cards.</param>
    /// <returns>Player's cards.</returns>
    public string[] Deal(Cards cards) 
    {
      List<string> dealt = new List<string>();
      int i = 1;
      Debugger.Emit(this.debug, "----------------------------------------------------");
      Debugger.Emit(this.debug, "Dealer is dealing cards for a new game...");
      Debugger.Emit(this.debug, "----------------------------------------------------");
      while(i <= (2 * 2)) 
      {
        dealt.Add(cards.Draw() + " " + cards.GetValue());
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
      Debugger.Emit(this.debug, String.Format("[**][{0}]", this.cards[1]));
      return new string[] { dealt[2], dealt[3] };
    }
  
    /// <summary>
    /// Determine if dealer has Blackjack.
    /// </summary>
    /// <returns>Does dealer have Blackjack?</returns>
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
  
    /// <summary>
    /// Determine if dealer is bust.
    /// </summary>
    /// <returns>Is dealer bust?</returns>
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
  
    /// <summary>
    /// Dealer responds to player action (e.g. a hit or stand).
    /// </summary>
    /// <param name="cards">Game cards.</param>
    /// <returns>Cards returned.</returns>
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
  
    /// <summary>
    /// Show dealer's cards.
    /// </summary>
    /// <returns>Total value of dealer's cards.</returns>
    public int ShowCards() 
    {
      this.index = 0;
      this.pos = 225;
      string cards = "";
      for(int i = 0; i < this.cards.Count; i++) 
      {
        cards += String.Format("[{0}]", this.cards[i]);
      }
      Debugger.Emit(this.debug, "\nDealer has:");
      Debugger.Emit(this.debug, String.Format("{0} --> {1}", cards, CalcTotal()));
      return CalcTotal();
    }
  
    /// <summary>
    /// Dealer receives cards.
    /// </summary>
    /// <param name="cards">Game cards.</param>
    /// <returns>Dealer's received cards.</returns>
    public List<Card> ReceiveCards(Cards cards) 
    {
      Card cardA = new Card(cards.GetImage("c"), this.pos, 10);
      this.pos += 90;
      Card cardB = new Card(cards.GetImage(this.cards[1]), this.pos, 10);
      this.index += 2;
      return new List<Card> { cardA, cardB };
    }
  
    /// <summary>
    /// Dealer reveals first card.
    /// </summary>
    /// <param name="cards">Game cards.</param>
    /// <returns>Revealed first card.</returns>
    public Card RevealFirstCard(Cards cards) 
    {
        return new Card(cards.GetImage(this.cards[0]), 225, 10);
    }
  }
}
