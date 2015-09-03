/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

public interface Actor
{
    int calcTotal();
    boolean hasBlackjack();
    boolean isBust();
    int showCards();
}
