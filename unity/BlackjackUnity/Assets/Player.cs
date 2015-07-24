/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/Unity implementation
*/
using UnityEngine;
using System;
using System.Collections.Generic;

/// <summary>
/// Player implements the player for Blackjack.
/// </summary>
public class Player {
    private bool debug;
    private int index;
    private int pos;
    private List<string> cards;
    private List<int> values;

    /// <summary>
    /// Constructor for player.
    /// </summary>
    /// <param name="debug"></param>
    public Player(bool debug) {
        this.debug = debug;
        this.index = -1;
        this.pos = 225;
        this.cards = new List<string>();
        this.values = new List<int>();
    }

    /// <summary>
    /// Calculate the total value of player's held cards.
    /// </summary>
    /// <returns>Total value for player's held cards.</returns>
    public int CalcTotal() {
        this.values.Sort();
        int total = 0;
        for (int i = 0; i < this.values.Count; i++) {
            int v = this.values[i];
            if (v == 1) {
                if ((total + 11) <= 21) v = 11;
                if ((total + 11) > 21) v = 1;
            }
            total += v;
        }
        return total;
    }

    /// <summary>
    /// Determine if player has Blackjack.
    /// </summary>
    /// <returns>Does player have Blackjack?</returns>
    public bool HasBlackjack() {
        bool blackjack = false;
        if (this.CalcTotal() == 21) {
            Debugger.Emit(this.debug, "Player has Blackjack!");
            blackjack = true;
        }
        return blackjack;
    }

    /// <summary>
    /// Determine if player is bust.
    /// </summary>
    /// <returns>Is player bust?</returns>
    public bool IsBust() {
        bool bust = false;
        if (this.CalcTotal() > 21) {
            Debugger.Emit(this.debug, "Player is bust!");
            bust = true;
        }
        return bust;
    }

    /// <summary>
    /// Receive cards from dealer.
    /// </summary>
    /// <param name="cards">Game cards.</param>
    /// <param name="player_cards">String[] of player's cards.</param>
    /// <returns></returns>
    public List<Card> ReceiveCards(Cards cards, string[] player_cards) {
        string pc = "";
        for (int i = 0; i < player_cards.Length; i++) {
            string[] cv = player_cards[i].Split();
            this.cards.Add(cv[0]);
            this.values.Add(int.Parse(cv[1]));
        }
        pc = String.Format("[{0}][{1}]", this.cards[0], this.cards[1]);
        Debugger.Emit(this.debug, "\nPlayer receives their cards:");
        Debugger.Emit(this.debug, String.Format("{0} --> {1}", pc, CalcTotal()));

        this.index++;
        Card cardA = new Card(cards.GetImage(this.cards[this.index]), this.pos, 310);
        this.pos += 90;
        this.index++;
        Card cardB = new Card(cards.GetImage(this.cards[this.index]), this.pos, 310);
        return new List<Card> { cardA, cardB };
    }

    /// <summary>
    /// Player hits.
    /// </summary>
    /// <param name="cards"></param>
    /// <returns></returns>
    public Card Hit(Cards cards) {
        string card = cards.Draw();
        this.cards.Add(card);
        this.values.Add(cards.GetValue());
        this.index++;
        this.pos += 90;
        Debugger.Emit(this.debug, "Player hits.");
        Debugger.Emit(this.debug, "Player gets " + card);
        Debugger.Emit(this.debug, String.Format("Player has {0}", CalcTotal()));
        return new Card(cards.GetImage(card), this.pos, 310);
    }

    /// <summary>
    /// Player stands.
    /// </summary>
    public void Stand() {
        Debugger.Emit(this.debug, "Player stands.");
        Debugger.Emit(this.debug, String.Format("Player has {0}", CalcTotal()));
    }

    /// <summary>
    /// Show player cards.
    /// </summary>
    /// <returns></returns>
    public int ShowCards() {
        this.index = 0;
        this.pos = 225;
        string cards = "";
        for (int i = 0; i < this.cards.Count; i++) {
            cards += String.Format("[{0}]", this.cards[i]);
        }
        Debugger.Emit(this.debug, "\nPlayer has:");
        Debugger.Emit(this.debug, String.Format("{0} --> {1}", cards, CalcTotal()));
        return CalcTotal();
    }
}
