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
  class Score 
  {
    private bool debug;
    private int posX;
    private int posY;
    private string score;
  
    public Score(bool debug, int posX, int posY) 
    {
      this.debug = debug;
      this.posX = posX;
      this.posY = posY;
      this.score = "";
      Debugger.Emit(this.debug, String.Format("Created score counter at %d,%d", this.posX, this.posY));
    }
  
    public void Emit(dynamic score) 
    {
      this.Clear();
      this.score = score.toString();
    }
  
    public void Clear() 
    {
      this.score = "";
    }
  
    public void Draw(SpriteBatch spriteBatch) 
    {
      Debugger.Emit(String.Format("Score is '%s'", this.score);
      // TODO Actual XNA draw
    }
  }
}
