/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack;

public interface IActor
{
    int calcTotal();
    boolean hasBlackjack();
    boolean isBust();
    int showCards();
}
