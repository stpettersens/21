/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import java.awt.Graphics;
import java.awt.Color;
import java.awt.Font;

public class UI implements IUI
{   
    /**
     *  Clear a UI item.
    */
    public void clear() {}
    
    /**
     * Draw a UI item.
     * @param g Graphics object.
    */
    public void draw(Graphics g)
    {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Verdana", Font.PLAIN, 12));
    }
}
