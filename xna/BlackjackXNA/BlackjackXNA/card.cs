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
    /// <summary>
    /// Card implements a single playing card.
    /// </summary>
    class Card
    {
        private Texture2D image;
        private int posX;
        private int posY;
        private Vector2 posXY;

        /// <summary>
        /// Constructor for card.
        /// </summary>
        /// <param name="card">Card texture.</param>
        /// <param name="posX">X position for card.</param>
        /// <param name="posY">Y position for card.</param>
        public Card(Texture2D card, int posX, int posY)
        {
            this.image = card;
            this.posX = posX;
            this.posY = posY;
            this.posXY = new Vector2(posX, posY);
        }

        /// <summary>
        /// Set X, Y position for card.
        /// </summary>
        /// <param name="posX">X position for card.</param>
        /// <param name="posY">Y position for card.</param>
        public void SetXY(int posX, int posY)
        {
            this.posXY = new Vector2(posX, posY);
        }

        /// <summary>
        /// Set X, Y position for card.
        /// </summary>
        /// <param name="posXY">X, Y position for card.</param>
        public void SetXY(Vector2 posXY)
        {
            this.posXY = posXY;
        }

        /// <summary>
        /// Get X, Y position of card as a Vector2.
        /// </summary>
        /// <returns>X, Y co-ordinates of card.</returns>
        public Vector2 GetXY() {
            return this.posXY;
        }

        /// <summary>
        /// Get X, Y position of card as int[].
        /// </summary>
        /// <returns>X, Y co-ordinates of card.</returns>
        public int[] GetXandY()
        {
            return new int[] { this.posX, this.posY };
        }

        /// <summary>
        /// Draw the card.
        /// </summary>
        /// <param name="spriteBatch">Sprite batch to draw with.</param>
        public void Draw(SpriteBatch spriteBatch)
        {
            spriteBatch.Draw(this.image, this.GetXY(), Color.White);
        }
    }
}
