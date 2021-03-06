﻿/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/Unity implementation
*/
using UnityEngine;
using System;
using System.Collections.Generic;

/// <summary>
/// Cards implements a collection of playing cards
/// and methods to draw and shuffle.
/// </summary>
public class Cards {
    private int index;
    private int deck_num;
    private List<string> deck;
    private List<string> played;
    private string[] ranks;
    private string[] suits;
    private List<string> strCards;
    private List<Texture2D> gfxCards;

    /// <summary>
    /// Constructor for cards.
    /// </summary>
    /// <param name="strCards">Cards as strings.</param>
    /// <param name="gfxCards">Cards as textures.</param>
    public Cards(List<string> strCards, List<Texture2D> gfxCards) {
        this.index = -1;
        this.deck_num = 52;
        this.deck = new List<string>();
        this.played = new List<string>();
        this.ranks = new string[] { "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };
        this.suits = new string[] { "h", "d", "c", "s" };
        this.strCards = strCards;
        this.gfxCards = gfxCards;
    }

    /// <summary>
    /// Get image for card from string pattern.
    /// </summary>
    /// <param name="card">Card string pattern.</param>
    /// <returns>Relevant card image.</returns>
    public Texture2D GetImage(string card) {
        char[] cardArray = card.ToCharArray();
        Array.Reverse(cardArray);
        if (cardArray.Length == 3) {
            if (cardArray[2] == '1') {
                cardArray[2] = '0';
                cardArray[1] = '1';
            }
        }
        return this.gfxCards[this.strCards.IndexOf(new string(cardArray))];
    }

    /// <summary>
    /// Get a rank for card.
    /// </summary>
    /// <returns>Card rank.</returns>
    private string GetRank() {
        System.Random rand = new System.Random();
        int i = rand.Next(0, this.ranks.Length);
        return this.ranks[i];
    }

    /// <summary>
    /// Get a suit for a card.
    /// </summary>
    /// <returns></returns>
    private string GetSuit() {
        System.Random rand = new System.Random();
        int i = rand.Next(0, this.suits.Length);
        return this.suits[i];
    }

    /// <summary>
    /// Get a card.
    /// </summary>
    /// <returns></returns>
    private string GetCard() {
        return String.Format("{0} {1}", this.GetRank(), this.GetSuit());
    }

    /// <summary>
    /// Shuffle cards.
    /// </summary>
    public void Shuffle() {
        this.index = -1;
        this.deck = new List<string>();
        this.played = new List<string>();
        while (true) {
            string card = this.GetCard();
            if (!this.deck.Contains(card)) {
                this.deck.Add(card);
                if (this.deck.Count == (deck_num - 17)) break;
            }
        }
    }

    /// <summary>
    /// Draw a card.
    /// </summary>
    /// <returns>Drawn card as string.</returns>
    public string Draw() {
        if (this.played.Count == this.deck_num | this.index == -1)
            this.index = 0;

        string card = this.deck[this.index].Replace(" ", "");
        this.played.Add(card);
        return card;
    }

    /// <summary>
    /// Get a card's value.
    /// </summary>
    /// <returns>Card's value.</returns>
    public int GetValue() {
        string[] rs = this.deck[this.index].Split();
        this.index++;
        int val = 0;
        if (rs[0] == "A") val = 1;
        else if (rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") val = 10;
        else val = int.Parse(rs[0]);
        return val;
    }

    /// <summary>
    /// Get number of played cards.
    /// </summary>
    /// <returns>Number of cards played.</returns>
    public int GetPlayed() {
        return this.played.Count;
    }

    /// <summary>
    /// Draw all the cards from a deck.
    /// </summary>
    /// <returns>All drawn cards.</returns>
    public List<string> DrawAll() {
        this.index = 0;
        List<string> draws = new List<string>();
        for (int i = 0; i < this.deck_num; i++) {
            draws.Add(this.Draw());
            this.index++;
        }
        this.index = -1;
        return draws;
    }
}
