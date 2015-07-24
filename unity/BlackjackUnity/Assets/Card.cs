/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/Unity implementation
*/
using UnityEngine;

/// <summary>
/// Card implements a single playing card.
/// </summary>
public class Card {
    private Texture2D image;
    private int posX;
    private int posY;

    /// <summary>
    /// Constructor for card.
    /// </summary>
    /// <param name="card">Card texture.</param>
    /// <param name="posX">X position for card.</param>
    /// <param name="posY">Y position for card.</param>
    public Card(Texture2D card, int posX, int posY) {
        this.image = card;
        this.posX = posX;
        this.posY = posY;
    }

    /// <summary>
    /// Set X, Y position for card.
    /// </summary>
    /// <param name="posX">X position for card.</param>
    /// <param name="posY">Y position for card.</param>
    public void SetXY(int posX, int posY) {
        this.posX = posX;
        this.posY = posY;
    }

    /// <summary>
    /// Get X, Y position of card.
    /// </summary>
    /// <returns>X, Y co-ordinates of card.</returns>
    public int[] GetXY() {
        return new int[] { this.posX, this.posY };
    }

    /// <summary>
    /// Draw the card.
    /// </summary>
    public void Draw() {
        GUI.DrawTexture(new Rect(this.posX, this.posY, 71, 96), this.image);
    }
}
