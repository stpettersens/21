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

public class Player implements Actor
{
    private boolean debug;
    private int index;
    private int pos;
    private List<String> cards;
    private List<Integer> values;

    /**
     * Dealer implements the player for Blackjack.
     * @param debug Enable debug messages?
    */
    public Player(boolean debug)
    {
        this.debug = debug;
        index = 0;
        pos = 225;
        cards = new ArrayList<String>();
        values = new ArrayList<Integer>();
    }
    
    /**
     * Calculate the total value of player's held cards.
     * @return Total value of player's cards.
    */
    public int calcTotal()
    {
        Collections.sort(values);
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
     * Dealer hits.
     * @param cards Game cards.
     * @return Dealer's drawn card.
    */
    private Card hit(Cards cards)
    {
        String card = cards.draw();
        this.cards.add(card);
        values.add(cards.getValue());
        index++;
        pos += 90;
        Debugger.emit(debug, "Player hits.");
        Debugger.emit(debug, "Player gets " + card);
        Debugger.emit(debug, String.format("Player has %d", calcTotal()));
        return new Card(cards.getImage(card), pos, 310);
    }
    
    /**
     * Dealer stands.
    */
    private void stand()
    {
        Debugger.emit(debug, "Player stands.");
        Debugger.emit(debug, String.format("Player has %d", calcTotal()));
    }
    
    /**
     * Dealer deals.
     * @param cards Game cards.
     * @return Player's cards.
    */
    public String[] deal(Cards cards)
    {
        List<String> dealt = new ArrayList<String>();
        int i = 1;
        Debugger.emit(debug, "----------------------------------------------------");
        Debugger.emit(debug, "Dealer is dealing cards for a new game...");
        Debugger.emit(debug, "----------------------------------------------------");
        while(i <= (2 * 2))
        {
            dealt.add(cards.draw() + " " + cards.getValue());
            i++;
        }
        i = 0;
        while(i < 2)
        {
            String[] cv = dealt.get(i).split(" ");
            this.cards.add(cv[0]);
            values.add(Integer.parseInt(cv[1]));
            i++;
        }
        Debugger.emit(debug, "\nDealer has:");
        Debugger.emit(debug, String.format("[**][%s]", this.cards.get(1)));
        return new String[] { dealt.get(2), dealt.get(3) };
    }
    
    /**
     * Determine if player has Blackjack.
     * @return Does player have Blackjack?
    */
    public boolean hasBlackjack()
    {
        boolean blackjack = false;
        if(calcTotal() == 21)
        {
            Debugger.emit(debug, "Dealer has Blackjack!");
            blackjack = true;
        }
        return blackjack;
    }
    
    /**
     * Determine if player is bust.
     * @return Is player bust?
    */
    public boolean isBust()
    {
        boolean bust = false;
        if(calcTotal() > 21)
        {
            Debugger.emit(debug, "Dealer is bust!");
            bust = true;
        }
        return bust;
    }
    
    /**
     * Show Player's cards.
     * @return Total value of player's cards.
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
        Debugger.emit(debug, "\nPlayer has:");
        Debugger.emit(debug, String.format("%s --> %d", cards, calcTotal())); 
        return calcTotal();
    }
    
    /**
     * Receive cards from dealer.
     * @param cards Game cards.
     * @param player_cards Player's cards as String[].
     * @return Player's cards as Card[].
    */
    public Card[] receiveCards(Cards cards, String[] player_cards)
    {
        String pc = "";
        for(int i = 0; i < player_cards.length; i++)
        {
            String[] cv = player_cards[i].split(" ");
            this.cards.add(cv[0]);
            values.add(Integer.parseInt(cv[1]));
        }
        pc = String.format("[%s][%s]", this.cards.get(0), this.cards.get(1));
        Debugger.emit(debug, "\nPlayer receives their cards:");
        Debugger.emit(debug, String.format("%s --> %d", pc, calcTotal()));
        
        //index++;
        Card cardA = new Card(cards.getImage(this.cards.get(index)), pos, 310);
        pos += 90;
        index++;
        Card cardB = new Card(cards.getImage(this.cards.get(index)), pos, 310);
        return new Card[] { cardA, cardB };
    }
}
