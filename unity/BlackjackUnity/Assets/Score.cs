/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/Unity implementation
*/
using UnityEngine;
using System;

/// <summary>
/// Score implements a score or information box.
/// </summary>
public class Score {
    private bool debug;
    private int posX;
    private int posY;
    private string score;

    /// <summary>
    /// Constructor for score.
    /// </summary>
    /// <param name="debug">Enable debug messages?</param>
    /// <param name="posX">X position for score box.</param>
    /// <param name="posY">Y position for score box.</param>
    public Score(bool debug, int posX, int posY) {
        this.debug = debug;
        this.posX = posX;
        this.posY = posY;
        Debugger.Emit(this.debug, String.Format("Created score counter at {0},{1}", posX, posY));
    }

    /// <summary>
    /// Emit a score or similar message.
    /// </summary>
    /// <param name="score">Score or similar mesage to emit.</param>
    public void Emit(string score) {
        this.Clear();
        this.score = score;
    }

    /// <summary>
    /// Emit a score.
    /// </summary>
    /// <param name="score">Score to emit.</param>
    public void Emit(int score) {
        this.Emit(score.ToString());
    }

    /// <summary>
    /// Clear the score box.
    /// </summary>
    public void Clear() {
        this.score = "";
    }

    /// <summary>
    /// Draw the score box.
    /// </summary>
    public void Draw() {
        Rect rect = new Rect(this.posX, this.posY, 400, 200);
        GUI.Label(rect, this.score);
    }
}
