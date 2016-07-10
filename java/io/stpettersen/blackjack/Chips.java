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
    private int deckWhite;
    private int deckRed;
    private int deckBlue;
    private int deckGreen;
    private int deckBlack;
    private int[] values;

    /**
     * Chip represents a collection of betting chips.
    */
    public Chips()
    {
        deckWhite = 0;
        deckRed = 0;
        deckBlue = 0;
        deckGreen = 0;
        deckBlack = 0;
        values = new int[] { 1, 5, 10, 25, 100 };
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
                value = values[0];
                break;
            case RED:
                value = values[1];
                break;
            case BLUE:
                value = values[2];
                break;
            case GREEN:
                value = values[3];
                break;
            case BLACK:
                value = values[4];
                break;
        }
        return value;
    }

    /**
     * Deal chips for a given betting balance.
     * @param balance Currency amount available to bet.
    */
    public void deal(int balance)
    {
        deckWhite = 0;
        deckRed = 0;
        deckBlue = 0;
        deckGreen = 0;
        deckBlack = 0;
        // Deal out white chips.
        for(int i = 0; i < Math.floor(balance / values[0]); i++)
            deckWhite++;
        // Deal out red chips.
        for(int i = 0; i < Math.floor(balance / values[1]); i++)
            deckRed++;
        // Deal out blue chips.
        for(int i = 0; i < Math.floor(balance / values[2]); i++)
            deckBlue++;
        // Deal out green chips.
        for(int i = 0; i < Math.floor(balance / values[3]); i++)
            deckGreen++;
        // Deal out black chips.
        for(int i = 0; i < Math.floor(balance / values[4]); i++)
            deckBlack++;
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
            if(color == ChipColor.WHITE && balance >= values[0])
                bet = getChip(ChipColor.WHITE);
            else if(color == ChipColor.RED && balance >= values[1])
                bet = getChip(ChipColor.RED);
            else if(color == ChipColor.BLUE && balance >= values[2])
                bet = getChip(ChipColor.BLUE);
            else if(color == ChipColor.GREEN && balance >= values[3])
                bet = getChip(ChipColor.GREEN);
            else if(color == ChipColor.BLACK && balance >= values[4])
                bet = getChip(ChipColor.BLACK);

            balance -= bet;
            return new int[] { color.ordinal(), balance };
        }
        return new int[] { -1, 0 };
    }

    /**
     * Get values for chips.
     * @return Values for each color chip.
    */
    public int[] getValues()
    {
        return values;
    }

    /**
     * Get number of available chips.
     * @return Numbers of each color chip.
    */
    public int[] getNums()
    {
        return new int[] { deckWhite, deckRed, deckBlue, deckGreen, deckBlack };
    }
}
