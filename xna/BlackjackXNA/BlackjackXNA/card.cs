/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BlackjackXNA
{
    class Card
    {
        private Texture2D image;
        private int posX;
        private int posY;

        /// <summary>
        /// Constructor for Card.
        /// </summary>
        /// <param name="card">Card texture</param>
        /// <param name="posX">X position for card</param>
        /// <param name="posY">Y position for card</param>
        public Card(Texture2D card, int posX, int posY)
        {
            this.image = card;
            this.posX = posX;
            this.posY = posY;
        }

        /// <summary>
        /// Get card image from string designation.
        /// E.g. Qh => hQ.png
        /// </summary>
        /// <param name="card">Card string designation</param>
        /// <returns>Path to card image to draw</returns>
        public static string GetImage(string card)
        {
            if (card == "c" || card == "d")
            {
                return String.Format("gfx/%s.png", card);
            }
            string suit = "";
            return suit;
        }

        /// <summary>
        /// Set X, Y position for card.
        /// </summary>
        /// <param name="posX">X position for card</param>
        /// <param name="posY">Y position for card</param>
        public void SetXY(int posX, int posY)
        {
            this.posX = posX;
            this.posY = posY;
        }

        /// <summary>
        /// Get X, Y position of card.
        /// </summary>
        /// <returns>X, Y co-ordinates of card</returns>
        public Vector2 GetXY() {
            return new Vector2(posX, posY);
        }

        /// <summary>
        /// Draw the card.
        /// </summary>
        /// <param name="spriteBatch">Sprite batch to draw with</param>
        public void Draw(SpriteBatch spriteBatch)
        {
            spriteBatch.Draw(this.image, this.GetXY(), Color.White);
        }
    }
}
