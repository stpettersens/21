/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack;
import io.stpettersen.helper.Debugger;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class Dealer extends Actor
{
    /**
     * Dealer implements the dealer for Blackjack.
     * @param debug Enable debug messages?
     * @param gameCards Game cards.
    */
    public Dealer(boolean debug, Cards gameCards)
    {
        super(debug, gameCards);
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
        pos = 90;
        Debugger.emit(debug, "Dealer hits.");
        Debugger.emit(debug, "Dealer gets " + card);
        Debugger.emit(debug, String.format("Dealer has %d", calcTotal()));
        return new Card(cards.getImage(card), pos, 10);
    }

    /**
     * Dealer stands.
    */
    protected void stand()
    {
        Debugger.emit(debug, "Dealer stands.");
    }

    /**
     * Dealer shuffles.
    */
    public void shuffle()
    {
        SoundEffects.play("shuffle");
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
        SoundEffects.play("deal");
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
        if(super.hasBlackjack())
        {
            Debugger.emit(debug, "Dealer has Blackjack!");
        }
        return super.hasBlackjack();
    }

    /**
     * Determine if dealer is bust.
     * @return Is dealer bust?
    */
    public boolean isBust()
    {
        if(super.isBust())
        {
            Debugger.emit(debug, "Dealer is bust!");
        }
        return super.isBust();
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
     * Show dealer's cards.
     * @return Total value of dealer's cards.
    */
    public int showCards()
    {
        Debugger.emit(debug, "\nDealer has:");
        return super.showCards();
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
        SoundEffects.play("reveal");
        return new Card(cards.getImage(this.cards.get(0)), 225, 10);
    }
}
