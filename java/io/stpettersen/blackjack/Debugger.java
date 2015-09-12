/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/
package io.stpettersen.blackjack;

public class Debugger
{
    /**
     * Emit a debug message.
     * @param debug Enable debug?
     * @param message String to emit.
    */
    public static void emit(boolean debug, String message)
    {
        if(debug) System.out.println(message);
    }
    
    /**
     * Emit a debug message.
     * @param debug Enable debug?
     * @param integer Integer to emit.
    */
    public static void emit(boolean debug, int integer)
    {
        emit(debug, Integer.toString(integer));
    }
    
    /**
     * Emit a debug message.
     * @param debug Enabele debug?
     * @param e Exception to emit.
    */
    public static void emit(boolean debug, Exception e)
    {
        emit(debug, String.format("EXCEPTION: %s", e.getMessage()));
    }
}
