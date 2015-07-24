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
using Helper;

namespace BlackjackXNA 
{
    /// <summary>
    /// Score implements a score or information box.
    /// </summary>
    class Score 
    {
        private bool debug;
        private Vector2 posXY;
        private string score;
        private SpriteFont font;
        
        /// <summary>
        /// Constructor for score.
        /// </summary>
        /// <param name="debug">Enable debug messages?</param>
        /// <param name="posX">X position for score box.</param>
        /// <param name="posY">Y position for score box.</param>
        /// <param name="font">Font to use.</param>
        public Score(bool debug, int posX, int posY, SpriteFont font) 
        {
            this.debug = debug;
            this.posXY = new Vector2(posX, posY);
            this.score = "";
            this.font = font;
            Debugger.Emit(this.debug, String.Format("Created score counter at {0},{1}", posX, posY));
        }

        /// <summary>
        /// Emit a score or similar message.
        /// </summary>
        /// <param name="score">Score or similar message to emit.</param>
        public void Emit(string score)
        {
            this.Clear();
            this.score = score;
        }
  
        /// <summary>
        /// Emit a score.
        /// </summary>
        /// <param name="score">Score to emit.</param>
        public void Emit(int score) 
        {
            this.Emit(score.ToString());
        }
  
        /// <summary>
        /// Clear the score box.
        /// </summary>
        public void Clear() 
        {
            this.score = "";
        }
  
        /// <summary>
        /// Draw the score box.
        /// </summary>
        /// <param name="spriteBatch">Sprite batch to draw with.</param>
        public void Draw(SpriteBatch spriteBatch) 
        {
            spriteBatch.DrawString(this.font, this.score, this.posXY, Color.White);
        }
    }
}
