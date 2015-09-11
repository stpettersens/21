/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack;

public class Chips
{
    private int deck_white;
    private int deck_red;
    private int deck_blue;
    private int deck_green;
    private int deck_black;
    private int[] amounts;
    
    /**
     * Chip represents a collection of betting chips.
    */
    public Chips()
    {
        deck_white = 0;
        deck_red = 0;
        deck_blue = 0;
        deck_green = 0;
        deck_black = 0;
        amounts = new int[] { 1, 5, 10, 25, 100 };
    }
    
    /**
     * Get chip currency value from color.
     * @param color Color of the chip.
     * @return Chip value.
    */
    private int getChip(ChipColor color)
    {
        int value = 0;
        switch(color)
        {
            case WHITE:
                value = amounts[0];
                break;
            case RED:
                value = amounts[1];
                break;   
            case BLUE:
                value = amounts[2];
                break;
            case GREEN:
                value = amounts[3];
                break;
            case BLACK:
                value = amounts[4];
                break;
        }
        return value;
    }
    
    /**
     * Deal chips for a given betting balance.
     * @param [number] balance Currency amount available to bet.
    */
    public void deal(int balance)
    {
        deck_white = 0;
        deck_red = 0;
        deck_blue = 0;
        deck_green = 0;
        deck_black = 0;
        Debugger.emit(true, String.format("Balance is $%d", balance));
        // Deal out white chips.
        for(int i = 0; i < Math.floor(balance / 1); i++) 
            deck_white++;
        // Deal out red chips.
        for(int i = 0; i < Math.floor(balance / 5); i++)
            deck_red++;
        // Deal out blue chips.
        for(int i = 0; i < Math.floor(balance / 10); i++)
            deck_blue++;
        // Deal out green chips.
        for(int i = 0; i < Math.floor(balance / 25); i++)
            deck_green++;
        // Deal out black chips.
        for(int i = 0; i < Math.floor(balance / 100); i++)
            deck_black++;
    }
    
    /**
     * Draw a chip.
     * @param color Color of chosen chip.
     * @param balance Currency amount available to bet.
     * @return Chosen color, new balance.
    */
    public int[] draw(ChipColor color, int balance)
    {
        if(balance > 0)
        {
            int bet = 0;
            if(color == ChipColor.WHITE && balance >= 1)
                bet = getChip(ChipColor.WHITE);
            else if(color == ChipColor.RED && balance >= 5)
                bet = getChip(ChipColor.RED);
            else if(color == ChipColor.BLUE && balance >= 10)
                bet = getChip(ChipColor.BLUE);
            else if(color == ChipColor.GREEN && balance >= 25)
                bet = getChip(ChipColor.GREEN);
            else if(color == ChipColor.BLACK && balance >= 100)
                bet = getChip(ChipColor.BLACK);
               
            balance = balance - bet;
            return new int[] { color.ordinal(), balance };
        }
        return new int[] { -1, 0 };
    }
    
    /**
     * Get number of available chips.
     * @return Numbers of each color chip.
    */
    public int[] getNums()
    {
        return new int[] { deck_white, deck_red, deck_blue, deck_green, deck_black };
    }
}
