/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack;
import io.stpettersen.helper.Debugger;
import java.awt.Graphics;

public class Score extends UI
{
    private String score;
    private int posX;
    private int posY;
    
    /**
     * Score implements a score or information box.
     * @param debug Enable debug messages?
     * @param posX X position for score box.
     * @param posY Y position for score box.
    */
    public Score(boolean debug, int posX, int posY)
    {
        this.posX = posX;
        this.posY = posY;
        score = "";
        Debugger.emit(debug, 
        String.format("Created score counter at %d,%d", posX, posY));
    }
    
    /**
     * Emit a score or similar message.
     * @param message Score or similar message to emit.
    */
    public void emit(String message) 
    {
        clear();
        score = message;
    }
    
    /**
     * Emit a score or other integer value.
     * @param score Score to emit.
    */
    public void emit(int score)
    {
        emit(Integer.toString(score));
    }
    
    /**
     * Clear the score box.
    */
    public void clear()
    {
        score = "";
    }
    
    /**
     * Draw the score box.
     * @param g Graphics object.
    */
    public void draw(Graphics g)
    {
        super.draw(g);
        g.drawString(score, posX, posY);
    }
}
