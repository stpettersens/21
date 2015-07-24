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
    /// Screentip implements a title and message box.
    /// </summary>
    class Screentip {
        private bool debug;
        private int posX;
        private int posY;
        private string title;
        private string msg;
        private SpriteFont font;
  
        /// <summary>
        /// Constructor for screentip.
        /// </summary>
        /// <param name="debug">Enable debug messages?</param>
        /// <param name="posX">X position for screentip.</param>
        /// <param name="posY">Y position for screentip.</param>
        /// <param name="font">Font to use for screentip.</param>
        public Screentip(bool debug, int posX, int posY, SpriteFont font) {
            this.debug = debug;
            this.posX = posX;
            this.posY = posY;
            this.font = font;
            Debugger.Emit(this.debug, String.Format("Created screentip at {0},{1}", posX, posY));
        }
  
        /// <summary>
        /// Emit a title and message.
        /// </summary>
        /// <param name="title">Title to emit.</param>
        /// <param name="message">Message to emit.</param>
        public void Emit(string title, string message) {
            this.Clear();
            this.title = title;
            this.msg = message;
        }
  
        /// <summary>
        /// Clear the screentip.
        /// </summary>
        public void Clear() {
            this.title = "";
            this.msg = "";
        }
  
        /// <summary>
        /// Draw the screentip.
        /// </summary>
        /// <param name="spriteBatch">Sprite batch to draw with.</param>
        public void Draw(SpriteBatch spriteBatch) {
            spriteBatch.DrawString(this.font, this.title, 
            new Vector2(this.posX, this.posY), Color.White);
            spriteBatch.DrawString(this.font, this.msg, 
            new Vector2(this.posX - 45, this.posY + 20), Color.White);
        }
    }
}
