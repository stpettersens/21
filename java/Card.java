/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

public class Card
{
    private String image;
    private int posX;
    private int posY;

    /**
     * Card implements a single playing card.
    */
    public Card(String card, int posX, int posY)
    {
        // initialise instance variables
        image = card;
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
    public void draw()
    {
        // TODO
    }
}
