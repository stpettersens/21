/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack;
import java.awt.Graphics;
import java.awt.Image;

public class Card
{
    private Image card;
    private int posX;
    private int posY;

    /**
     * Card implements a single playing card.
    */
    public Card(Image card, int posX, int posY)
    {
        // initialise instance variables
        this.card = card;
        this.posX = posX;
        this.posY = posY;
    }

    /**
     * Set X, Y position for card.
     * @param posX X position for card.
     * @param posY Y position for card.
    */
    public void setXY(int posX, int posY)
    {
        this.posX = posX;
        this.posY = posY;
    }

    /**
     * Get X, Y positionof card as int[].
     * @return X, Y co-ordinates of card.
    */
    public int[] getXY()
    {
        return new int[] { posX, posY };
    }

    /**
     * Draw the card.
    */
    public void draw(Graphics g)
    {
        g.drawImage(card, posX, posY, null);
    }
}
