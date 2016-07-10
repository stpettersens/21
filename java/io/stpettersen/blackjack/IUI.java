/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack;

import java.awt.Graphics;

public interface IUI
{
    void clear();
    void draw(Graphics g);
}
