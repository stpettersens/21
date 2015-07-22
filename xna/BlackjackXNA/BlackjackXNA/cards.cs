/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BlackjackXNA
{
    class Cards
    {
        private int index;
        private int deck_num;
        private List<string> deck;
        private List<string> played;
        private string[] ranks;
        private string[] suits;
        private List<string> strCards;
        private List<Texture2D> gfxCards;

        public Cards(List<string> strCards, List<Texture2D> gfxCards)
        {
            this.index = -1;
            this.deck_num = 52;
            this.deck = new List<string>();
            this.played = new List<string>();
            this.ranks = new string[] { "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };
            this.suits = new string[] { "h", "d", "c", "s" };
            this.strCards = strCards;
            this.gfxCards = gfxCards;
        }

        public Texture2D GetCardImages(string card)
        {
            return this.gfxCards[this.strCards.IndexOf(card)];
        }

        private string GetRank()
        {
            Random rand = new Random();
            int i = rand.Next(0, this.ranks.Length);
            return this.ranks[i];
        }

        private string GetSuit()
        {
            Random rand = new Random();
            int i = rand.Next(0, this.suits.Length);
            return this.suits[i];
        }

        private string GetCard()
        {
            return String.Format("%s %s", this.GetRank(), this.GetSuit());
        }

        public void Shuffle()
        {
            this.index = -1;
            this.deck = new List<string>();
            this.played = new List<string>();
            while (true)
            {
                string card = this.GetCard();
                if (!this.deck.Contains(card))
                {
                    this.deck.Add(card);
                    if (this.deck.Count == this.deck_num) break;
                }
            }
        }

        public string Draw()
        {
            if (this.played.Count == this.deck_num || this.index == -1)
            {
                this.index = 0;
            }
            this.played.Add(this.deck[this.index]);
            return this.deck[this.index].Replace(" ", "");
        }

        public int GetValue()
        {
            string[] rs = this.deck[this.index].Split();
            this.index++;
            int val = 0;
            if (rs[0] == "A") val = 1;
            else if (rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") val = 10;
            else val = int.Parse(rs[0]);
            return val;
        }

        public int GetPlayed()
        {
            return this.played.Count;
        }

        public List<string> DrawAll()
        {
            this.index = 0;
            List<string> draws = new List<string>();
            for (int i = 0; i < this.deck_num; i++)
            {
                draws.Add(this.Draw());
                this.index++;
            }
            this.index = -1;
            return draws;
        }
    }
}
