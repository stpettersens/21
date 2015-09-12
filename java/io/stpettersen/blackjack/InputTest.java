package io.stpettersen.blackjack;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import java.io.*;

public class InputTest
{
    private int balance;
    private final String TITLE = "Blackjack";
    private final boolean DEBUG = true;
    
    public InputTest()
    {
        balance = 1000;
    }
    
    /**
     * Place a bet.
    */
    private void placeBet()
    {
        JFrame frame = new JFrame();
        String response = (String)JOptionPane.showInputDialog(frame, "Place bet ($):");
        try {
            int bet = Integer.parseInt(response);
            if(bet > 0 && bet <= balance)
            {
                balance -= bet;
                System.out.println(balance);
                //newGame();
            }
            else
            {
                JOptionPane.showMessageDialog(frame, 
                String.format("Bet must be between $1 and $%d.", balance), TITLE,
                JOptionPane.WARNING_MESSAGE);
                placeBet();
            }
        }
        catch(NumberFormatException e) 
        {
            JOptionPane.showMessageDialog(frame,
            "Bet must be numeric value", TITLE,
            JOptionPane.WARNING_MESSAGE);
            Debugger.emit(DEBUG, e);
            placeBet();
        }
    }
    
    public static void main(String[] args)
    {
        InputTest it = new InputTest();
        it.placeBet();
    }
}
