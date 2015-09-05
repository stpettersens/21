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

public class Screentip extends UI
{
    private int posX;
    private int posY;
    private String title;
    private String msg;
    
    /**
     * Screentip implements a title and message box.
     * @param debug Enable debug messages?
     * @param posX X position for screentip.
     * @param posY Y position for screentip.
    */
    public Screentip(boolean debug, int posX, int posY)
    {
        this.posX = posX;
        this.posY = posY;
        Debugger.emit(debug, 
        String.format("Created screentip at %d,%d", posX, posY));
    }
    
    /**
     * Emit a title and message.
     * @param title Title to emit.
     * @param message Message to emit.
    */
    public void emit(String title, String message)
    {
        clear();
        this.title = title;
        msg = message;
    }
    
    /**
     * Clear the screentip.
    */
    public void clear()
    {
        title = "";
        msg = "";
    }
    
    /**
     * Draw the screentip.
     * @param g Graphics object.
    */
    public void draw(Graphics g)
    {
        super.draw(g);
        g.drawString(title, posX, posY);
        g.drawString(msg, (posX - 45), (posY + 20));
    }
}
