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

public class Player extends Actor
{
    /**
     * Player implements the player for Blackjack.
     * @param debug Enable debug messages?
    */
    public Player(boolean debug)
    {
        super(debug);
    }

    /**
     * Player hits.
     * @param cards Game cards.
     * @return Player's drawn card.
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
     * Player stands.
    */
    protected void stand()
    {
        Debugger.emit(debug, "Player stands.");
        Debugger.emit(debug, String.format("Player has %d", calcTotal()));
    }
    
    /**
     * Determine if player has Blackjack.
     * @return Does player have Blackjack?
    */
    public boolean hasBlackjack()
    {
        Debugger.emit(debug, "Player has Blackjack!");
        return super.hasBlackjack();
    }
    
    /**
     * Determine if player is bust.
     * @return Is player bust?
    */
    public boolean isBust()
    {
        Debugger.emit(debug, "Player is bust!");
        return super.isBust();
    }
    
    /**
     * Show Player's cards.
     * @return Total value of player's cards.
    */
    public int showCards()
    {
        Debugger.emit(debug, "\nPlayer has:");
        return super.showCards();
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
