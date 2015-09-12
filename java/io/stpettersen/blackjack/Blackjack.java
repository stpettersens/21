/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

package io.stpettersen.blackjack; 
import java.util.List;
import java.util.ArrayList;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Blackjack extends JPanel implements ActionListener
{
    private boolean ai;
    private boolean sound;
    private boolean playing;
    private int player_index;
    private List<Card> player_cards;
    private int dealer_index;
    private List<Card> dealer_cards;
    private Screentip screentip;
    private Score instruction;
    private Score pScore;
    private Score dScore;
    private Score pBalance;
    private Score wChips;
    private Score rChips;
    private Score bChips; 
    private Score gChips;
    private Score blChips;
    private Card dealer_pile;
    private Cards cards;
    private Player player;
    private Dealer dealer;
    private Chips chips;
    private int balance;
    private int bet;
    private static JButton toggleSound;
    private static JButton hit;
    private static JButton stand;
    
    private final static String TITLE = "Blackjack";
    private final static int SCREEN_WIDTH = 820;
    private final static int SCREEN_HEIGHT = 560;
    private final int CARD_LIMIT = 42;
    private final boolean DEBUG = false;
     
    /**
     * Blackjack implements the game itself.
    */
    public Blackjack() 
    {
        super();
        setBackground(new Color(0, 153, 0));
        ai = false;
        sound = true;
        playing = false;
        balance = 1000;
        bet = 0;
        screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 50), 190);
        instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 155), 450);
        pScore = new Score(DEBUG, 153, 315);
        dScore = new Score(DEBUG, 153, 25);
        pBalance = new Score(DEBUG, 10, 410);
        wChips = new Score(DEBUG, 10, 430);
        rChips = new Score(DEBUG, 10, 450);
        bChips = new Score(DEBUG, 10, 470);
        gChips = new Score(DEBUG, 10, 490);
        blChips = new Score(DEBUG, 10, 510);
        chips = new Chips();
        cards = new Cards();
        dealer_pile = new Card(cards.getImage("c"), 10, 10);
        SoundEffects.init();
        Debugger.emit(DEBUG, "Initialized Blackjack (Java Swing/AWT).");
    }
    
    /**
     * Toggle sound effects on/off. 
    */
    private void toggleSound()
    {
        sound = SoundEffects.toggle();
        Debugger.emit(DEBUG, "----------------------------------------------------");
        Debugger.emit(DEBUG, String.format("Sound effects on: %b", sound));
        Debugger.emit(DEBUG, "----------------------------------------------------");
        update();
    }
    
    /**
     * Place a bet.
    */
    private void placeBet()
    {
        JFrame frame = new JFrame();
        String response = (String)JOptionPane.showInputDialog(frame, "Place bet ($):");
        try {
            bet = Integer.parseInt(response);
            if(bet > 0 && bet <= balance)
            {
                balance -= bet;
                Debugger.emit(DEBUG, String.format("Placed bid of $%d", bet));
                //chips.deal(balance);
                newGame();
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
    
    /**
     * Start a new game.
    */
    private void newGame() 
    {   
        chips.deal(balance);
        hit.setText("Hit");
        stand.setVisible(true);
        playing = true;
        player_index = 2;
        player_cards = new ArrayList<Card>();
        dealer_index = 2;
        dealer_cards = new ArrayList<Card>();
        
        player = new Player(DEBUG);
        dealer = new Dealer(DEBUG, cards);
        
        if(cards.getPlayed() == 0 || cards.getPlayed() >= CARD_LIMIT)
        {
            dealer.shuffle();
        }
        
        screentip.clear();
        Card[] pc = player.receiveCards(cards, dealer.deal(cards));
        Card[] dc = dealer.receiveCards(cards);
        player_cards.add(pc[0]);
        player_cards.add(pc[1]);
        dealer_cards.add(dc[0]);
        dealer_cards.add(dc[1]);
        player_cards.add(new Card(cards.getImage("d"), 405, 310));
        player_cards.add(new Card(cards.getImage("d"), 495, 310));
        player_cards.add(new Card(cards.getImage("d"), 585, 310));
        dealer_cards.add(new Card(cards.getImage("d"), 405, 10));
        dealer_cards.add(new Card(cards.getImage("d"), 495, 10));
        dealer_cards.add(new Card(cards.getImage("d"), 585, 10));
        update();
    }
    
    /**
     * Show cards at end of game.
    */
    private void showCards()
    {
        hit.setText("Play");
        stand.setVisible(false);
        playing = false;
        dealer_cards.set(0, dealer.revealFirstCard(cards));
        int ds = dealer.showCards();
        int ps = player.showCards();
        boolean betWon = false;
        boolean refundBet = false;
        
        if(ps == 21 && ds != 21)
        {
            screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
            betWon = true;
        }
        else if(ds == 21 && ps != 21)
        {
            screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
        }
        else if((ps == ds) || (ps > 21 && ds > 21))
        {
            screentip.emit("PUSH", "Neither dealer nor player won.");
            refundBet = true;
        }
        else if(ps <= 21 && ps > ds)
        {
            screentip.emit("PLAYER WINS", String.format("Player wins with %d. Well done.", ps));
            betWon = true;
        }
        else if(ds <= 21 && ds > ps)
        {
            screentip.emit("DEALER WINS", String.format("Dealer wins with %d. Too bad.", ds));
        }
        else if(ps > 21 && ds <= 21)
        {
            screentip.emit("DEALER WINS", "Dealer wins. Player bust.");
        }
        else if(ds > 21 && ps <= 21)
        {
            screentip.emit("PLAYER WINS", "Player wins. Dealer bust.");
            betWon = true;
        }
        
        dScore.emit(dealer.calcTotal());
        Debugger.emit(DEBUG, String.format("Cards played %d", cards.getPlayed()));
        
        if(cards.getPlayed() >= CARD_LIMIT)
        {
            instruction.emit("Dealer is shuffling cards...");
        }
        else
        {
            instruction.emit("Play again?");
        }
        
        if(cards.getPlayed() == 52)
        {
            dealer_pile = new Card(cards.getImage("d"), 10, 10);
        }
        
        if(betWon)
        {
            balance += bet * 2; // Player wins bet; receives their bet + dealer's.
        }
        else if(refundBet)
        {
            balance += bet; // Player's bet is refunded on a push.
        }
        chips.deal(balance);
        repaint();
    }
    
    /**
     * Update logic.
    */
    private void update()
    {
        // Display status of sound (i.e. sound on/off).
        if(sound)
            toggleSound.setText("Sound off");
        else
            toggleSound.setText("Sound on");
        
        // Determine if a Blackjack or bust has occurred?
        if(hasBlackjack() || isBust() || player_index == 5)
            showCards();
        
        pScore.emit(player.calcTotal());
        pBalance.emit(String.format("Balance: $%d", balance));
        
        int[] chipVals = chips.getValues();
        int[] chipNums = chips.getNums();
        wChips.emit(String.format("White chips ($%d): %d", chipVals[0], chipNums[0]));
        rChips.emit(String.format("Red chips ($%d): %d", chipVals[1], chipNums[1]));
        bChips.emit(String.format("Blue chips ($%d): %d", chipVals[2], chipNums[2]));
        gChips.emit(String.format("Green chips ($%d): %d", chipVals[3], chipNums[3]));
        blChips.emit(String.format("Black chips ($%d): %d", chipVals[4], chipNums[4]));
        
        if(playing)
        {
            dScore.emit("?");
            instruction.emit("Hit or Stand?");
        }
        repaint();
    }
    
    /**
     * Determine if a Blackjack has occurred.
     * @return Has a Blackjack occurred?
    */
    private boolean hasBlackjack()
    {
        boolean blackjack = false;
        if(player.hasBlackjack() || dealer.hasBlackjack())
        {
            blackjack = true;
        }
        return blackjack;
    }
    
    /**
     * Determine if a bust has occurred.
     * @return Has a bust occurred?
    */
    private boolean isBust()
    {
        boolean bust = false;
        if(player.isBust() || dealer.isBust())
        {
            bust = true;
        }
        return bust;
    }
    
    /**
     * Take a hit.
    */
    private void hit()
    {
        if(player_index < 6)
        {
            SoundEffects.play("hit");
            player_cards.set(player_index, player.hit(cards));
            int[] xy = player_cards.get(player_index).getXY();
            Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy[0], xy[1]));
            player_index++;
            repaint();
        }
        else stand();
    }
    
    /**
     * Take a stand.
    */
    private void stand()
    {
        player.stand();
        List<Card> received = dealer.respond(cards);
        for(int i = 0; i < received.size(); i++)
        {
            int[] xy = dealer_cards.get(dealer_index).getXY();
            dealer_cards.set(dealer_index, received.get(i));
            dealer_cards.get(dealer_index).setXY(xy[0], xy[1]);
            Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy[0], xy[1]));
            Debugger.emit(DEBUG, dealer_index);
            dealer_index++;
        }
        showCards();
        repaint();
    }
    
    /**
     * Event handler for hit or stand buttons.
     * @param e ActionEvent
    */
    public void actionPerformed(ActionEvent e)
    {
        Object src = e.getSource();
        if(src == toggleSound)
        {
            toggleSound();
        }
        else if(src == hit)
        {
            if(playing) hit();
            else placeBet();
            
        }
        else if(src == stand)
        {
            if(playing) stand();
        }
        update();
    }
    
    /**
     * Draw elements to game window.
     * @param g Graphics object.
    */
    public void paint(Graphics g)
    {
        int width = getWidth();
        int height = getHeight();
        super.paint(g);
        dealer_pile.draw(g);
        screentip.draw(g);
        instruction.draw(g);
        pScore.draw(g);
        dScore.draw(g);
        pBalance.draw(g);
        wChips.draw(g);
        rChips.draw(g);
        bChips.draw(g);
        gChips.draw(g);
        blChips.draw(g);
        for(int i = 0; i < dealer_cards.size(); i++)
        {
            dealer_cards.get(i).draw(g);
            player_cards.get(i).draw(g);
        }
    }
    
    /**
     * Entry method for game.
     * @param args Command line arguments.
    */
    public static void main(String[] args)
    {
        Blackjack blackjack = new Blackjack();
        JFrame app = new JFrame();
        hit = new JButton("Bet");
        stand = new JButton("Stand");
        stand.setVisible(false);
        toggleSound = new JButton();
        
        hit.setBounds(10,320,100,25);
        stand.setBounds(10,350,100,25);
        toggleSound.setBounds(675,5,130,25);
        hit.addActionListener(blackjack);
        stand.addActionListener(blackjack);
        toggleSound.addActionListener(blackjack);
        app.add(hit);
        app.add(stand);
        app.add(toggleSound);
        
        app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        app.add(blackjack);
        app.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        app.setTitle(TITLE);
        app.setVisible(true);
        app.setResizable(false);
        
        blackjack.newGame();
    }
}
