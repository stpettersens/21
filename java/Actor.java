/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class Actor implements IActor
{
    protected boolean debug;
    protected int index;
    protected int pos;
    protected List<String> cards;
    protected List<Integer> values;
    protected Cards gameCards;
    protected SoundEffects soundEffects;

    /**
     * Actor implements the common player/dealer for Blackjack.
     * @param debug Enable debug messages?
     * @param gameCards Game cards.
    */
    public Actor(boolean debug, Cards gameCards, SoundEffects soundEffects)
    {
        this.debug = debug;
        index = 0;
        pos = 225;
        cards = new ArrayList<String>();
        values = new ArrayList<Integer>();
        this.gameCards = gameCards;
        this.soundEffects = soundEffects;
    }
    
    /**
     * Actor implements the common player/dealer for Blackjack.
     * @param debug Enable debug messages?
    */
    public Actor(boolean debug)
    {
        this(debug, null, null);
    }
    
    /**
     * Calculate the total value of actor's held cards.
     * @return Total value of actor's cards.
    */
    public int calcTotal()
    {
        Comparator cmp = Collections.reverseOrder();
        Collections.sort(values, cmp);
        int total = 0;
        for(int i = 0; i < values.size(); i++)
        {
            int v = values.get(i);
            if(v == 1)
            {
                if((total + 11) <= 21) v = 11;
                else if((total + 11) > 21) v = 1;
            }
            total += v;    
        }
        return total;
    }
    
    /**
     * Actor stands.
    */
    protected void stand() {}
    
    /**
     * Determine if actor has Blackjack.
     * @return Does actor have Blackjack?
    */
    public boolean hasBlackjack()
    {
        boolean blackjack = false;
        if(calcTotal() == 21)
        {
            blackjack = true;
        }
        return blackjack;
    }
    
    /**
     * Determine if actor is bust.
     * @return Is actor bust?
    */
    public boolean isBust()
    {
        boolean bust = false;
        if(calcTotal() > 21)
        {
            bust = true;
        }
        return bust;
    }
    
    /**
     * Show actor's cards.
     * @return Total value of actor's cards.
    */
    public int showCards()
    {
        index = 0;
        pos = 225;
        String cards = "";
        for(int i = 0; i < this.cards.size(); i++)
        {
            cards += String.format("[%s]", this.cards.get(i));
        }
        Debugger.emit(debug, String.format("%s --> %d", cards, calcTotal())); 
        return calcTotal();
    }
}
