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

public class Dealer implements Actor
{
    private boolean debug;
    private int index;
    private int pos;
    private List<String> cards;
    private List<Integer> values;
    private Cards gameCards;

    /**
     * Dealer implements the dealer for Blackjack.
     * @param debug Enable debug messages?
     * @param gameCards Game cards.
    */
    public Dealer(boolean debug, Cards gameCards)
    {
        this.debug = debug;
        index = 0;
        pos = 225;
        cards = new ArrayList<String>();
        values = new ArrayList<Integer>();
        this.gameCards = gameCards;
    }
    
    /**
     * Calculate the total value of Dealer's held cards.
     * @return Total value of dealer's cards.
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
        index++;
        pos = 90;
        String card = cards.draw();
        this.cards.add(card);
        values.add(cards.getValue());
        Debugger.emit(debug, "Dealer hits.");
        Debugger.emit(debug, "Dealer gets " + card);
        return new Card(cards.getImage(card), pos, 10);
    }
    
    /**
     * Dealer stands.
    */
    private void stand()
    {
        Debugger.emit(debug, "Dealer stands.");
    }
    
    /**
     * Dealer shuffles.
    */
    public void shuffle()
    {
        Debugger.emit(debug, "----------------------------------------------------");
        Debugger.emit(debug, "Dealer is shuffling cards...");
        Debugger.emit(debug, "----------------------------------------------------");
        gameCards.shuffle();
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
     * Determine if dealer has Blackjack.
     * @return Does dealer have Blackjack?
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
     * Determine if Dealer is bust.
     * @return Is dealer bust?
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
     * Dealer responds to player action (e.g. a hit or stand).
     * @param cards Game cards.
     * @return Cards returned.
    */
    public List<Card> respond(Cards cards)
    {
        showCards();
        boolean responding = true;
        List<Card> response_cards = new ArrayList<Card>();
        while(responding)
        {
            int total = 0;
            while(total <= 18)
            {
                total = calcTotal();
                if(total == 16)
                {
                    if(Math.floor(Math.random() * 6) >= 3)
                    {
                        response_cards.add(hit(cards)); // Take risk.
                    }
                    else
                    {
                        stand(); // Play it safe.
                    }
                }
                else if(total >= 17)
                {
                    stand();
                    responding = false;
                    break;
                }
                else
                {
                    response_cards.add(hit(cards));
                }
            }
        }
        return response_cards;
    }
    
    /**
     * Show Dealer's cards.
     * @return Total value of dealer's cards.
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
        Debugger.emit(debug, "\nDealer has:");
        Debugger.emit(debug, String.format("%s --> %d", cards, calcTotal())); 
        return calcTotal();
    }
    
    /**
     * Dealer receives cards.
     * @param cards Game cards.
     * @return Dealer's received cards.
    */
    public Card[] receiveCards(Cards cards)
    {
        Card cardA = new Card(cards.getImage("c"), pos, 10);
        pos += 90;
        Card cardB = new Card(cards.getImage(this.cards.get(1)), pos, 10);
        index += 2;
      
        return new Card[] { cardA, cardB };
    }
    
    /**
     * Dealer reveals first card.
     * @param cards Game cards.
     * @return Revealed first card.
    */
    public Card revealFirstCard(Cards cards)
    {
        return new Card(cards.getImage(this.cards.get(0)), 225, 10);
    }
}
