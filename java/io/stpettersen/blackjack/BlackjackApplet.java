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
import javax.swing.JApplet;
import javax.swing.JFrame;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JRootPane;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class BlackjackApplet extends JApplet implements ActionListener
{
    private boolean ai;
    private boolean playing;
    private int playerIndex;
    private List<Card> playerCards;
    private int dealerIndex;
    private List<Card> dealerCards;
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
    private Card dealerPile;
    private Cards cards;
    private Player player;
    private Dealer dealer;
    private Chips chips;
    private int balance;
    private int bet;
    private JButton hit;
    private JButton stand;
    
    private final String TITLE = "Blackjack";
    private final int SCREEN_WIDTH = 820;
    private final int SCREEN_HEIGHT = 560;
    private final int CARD_LIMIT = 42;
    private final boolean DEBUG = false;

    /**
     * Called by the browser or applet viewer to inform this JApplet that it
     * has been loaded into the system. It is always called before the first 
     * time that the start method is called.
     */
    public void init()
    {
        // this is a workaround for a security conflict with some browsers
        // including some versions of Netscape & Internet Explorer which do 
        // not allow access to the AWT system event queue which JApplets do 
        // on startup to check access. May not be necessary with your browser. 
        JRootPane rootPane = this.getRootPane();    
        rootPane.putClientProperty("defeatSystemEventQueueCheck", Boolean.TRUE);
    
        // provide any initialisation necessary for your JApplet
        ai = false;
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
        dealerPile = new Card(cards.getImage("c"), 10, 10);
        hit = new JButton();
        stand = new JButton("Stand");
        hit.addActionListener(this);
        stand.addActionListener(this);
        this.add(hit);
        this.add(stand);
        Debugger.emit(DEBUG, "Initialized Blackjack Applet (Java Swing/AWT).");
    }

    /**
     * Called by the browser or applet viewer to inform this JApplet that it 
     * should start its execution. It is called after the init method and 
     * each time the JApplet is revisited in a Web page. 
     */
    public void start()
    {
        // provide any code requred to run each time 
        // web page is visited
        startFirstGame();
    }

    /** 
     * Called by the browser or applet viewer to inform this JApplet that
     * it should stop its execution. It is called when the Web page that
     * contains this JApplet has been replaced by another page, and also
     * just before the JApplet is to be destroyed. 
     */
    public void stop()
    {
        // provide any code that needs to be run when page
        // is replaced by another page or before JApplet is destroyed 
    }
    
    /**
     * Place a bet.
    */
    private void placeBet()
    {
        JFrame frame = new JFrame();
        if(balance == 0)
        {
            balance = 1000;
            int response = JOptionPane.showConfirmDialog(frame,
            "Out of chips. Play again?",
            TITLE,
            JOptionPane.YES_NO_OPTION);
            if(response == 0)
                JOptionPane.showMessageDialog(frame,
                String.format("Received $%d in chips.", balance));
        }
        String response = (String)JOptionPane.showInputDialog(frame,
        "Place bet ($):");
        try
        {
            bet = Integer.parseInt(response);
            if(bet > 0 && bet <= balance)
            {
                balance -= bet;
                Debugger.emit(DEBUG, 
                String.format("Placed bid of $%d", bet));
                newGame();
            }
            else 
            {
                JOptionPane.showMessageDialog(frame,
                String.format("Bet must be between $1 and $%d", balance),
                TITLE, JOptionPane.WARNING_MESSAGE);
                placeBet();
            }
        }
        catch(NumberFormatException e)
        {
            JOptionPane.showMessageDialog(frame,
            "Bet must be numeric value.", TITLE,
            JOptionPane.WARNING_MESSAGE);
            Debugger.emit(DEBUG, e);
            placeBet();
        }
    }
    
    /**
     * Start the first game.
    */
    private void startFirstGame()
    {
        hit.setText("Play");
        stand.setVisible(false);
        playing = false;
        playerCards = new ArrayList<Card>();
        dealerCards = new ArrayList<Card>();
        
        player = new Player(DEBUG);
        dealer = new Dealer(DEBUG, cards);
        
        screentip.clear();
        instruction.emit("Click Play to start a new game.");
        chips.deal(balance);
        update();
    }
    
    /**
     * Start a new game.
    */
    private void newGame()
    {
        hit.setText("Hit");
        stand.setVisible(true);
        playing = true;
        playerIndex = 2;
        playerCards = new ArrayList<Card>();
        dealerIndex = 2;
        dealerCards = new ArrayList<Card>();
        
        player = new Player(DEBUG);
        dealer = new Dealer(DEBUG, cards);
        
        if(cards.getPlayed() == 0 || cards.getPlayed() >= CARD_LIMIT)
        {
            dealer.shuffle();
        }
        
        screentip.clear();
        Card[] pc = player.receiveCards(cards, dealer.deal(cards));
        Card[] dc = dealer.receiveCards(cards);
        playerCards.add(pc[0]);
        playerCards.add(pc[1]);
        dealerCards.add(dc[0]);
        dealerCards.add(dc[1]);
        playerCards.add(new Card(cards.getImage("d"), 405, 310));
        playerCards.add(new Card(cards.getImage("d"), 495, 310));
        playerCards.add(new Card(cards.getImage("d"), 585, 310));
        dealerCards.add(new Card(cards.getImage("d"), 405, 10));
        dealerCards.add(new Card(cards.getImage("d"), 495, 10));
        dealerCards.add(new Card(cards.getImage("d"), 585, 10));
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
        dealerCards.set(0, dealer.revealFirstCard(cards));
        int ds = dealer.showCards();
        int ps = player.showCards();
        boolean betWon = false;
        boolean refundBet = false;
        
        if(ps == 21 && ds != 21 && playerIndex == 2)
        {
            screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
            betWon = true;
        }
        else if(ds == 21 && ps != 21 && dealerIndex == 2)
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
            dealerPile = new Card(cards.getImage("d"), 10, 10);
        }
        
        if(betWon)
        {
            balance += (bet * 2); // Player wins bet; receive bet + dealer's.
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
        // Determine if a Blackjack or bust has occurred?
        if(hasBlackjack() || isBust() || playerIndex == 5)
            showCards();
        
        int score = player.calcTotal();
        if(score > 0) pScore.emit(score);
        pBalance.emit(String.format("Balance: $%d", balance));
        
        int[] chipVals = chips.getValues();
        int[] chipNums = chips.getNums();
        wChips.emit(String.format("White chips ($%d): %d", 
        chipVals[0], chipNums[0]));
        rChips.emit(String.format("Red chips ($%d): %d",
        chipVals[1], chipNums[1]));
        bChips.emit(String.format("Blue chips ($%d): %d",
        chipVals[2], chipNums[2]));
        gChips.emit(String.format("Green chips ($%d): %d",
        chipVals[3], chipNums[3]));
        blChips.emit(String.format("Black chips ($%d): %d",
        chipVals[4], chipNums[4]));
        
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
        if(playerIndex < 6)
        {
            playerCards.set(playerIndex, player.hit(cards));
            int[] xy = playerCards.get(playerIndex).getXY();
            Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy[0], xy[1]));
            playerIndex++;
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
            int[] xy = dealerCards.get(dealerIndex).getXY();
            dealerCards.set(dealerIndex, received.get(i));
            dealerCards.get(dealerIndex).setXY(xy[0], xy[1]);
            Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy[0], xy[1]));
            Debugger.emit(DEBUG, dealerIndex);
            dealerIndex++;
        }
        showCards();
        repaint();
    }
    
    /**
     * Event handler for hit or stand buttons.
     * @param e ActionEvent.
    */
    public void actionPerformed(ActionEvent e)
    {
        Object src = e.getSource();
        if(src == hit)
        {
            if(playing) hit();
            else placeBet();
        }
        else if(src == stand)
        {
            if(playing) stand();
            else placeBet();
        }
        update();
    }

    /**
     * Paint method for applet.
     * @param g Graphics object for this applet.
     */
    public void paint(Graphics g)
    {
        g.setColor(new Color(0, 153, 0));
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        dealerPile.draw(g);
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
        for(int i = 0; i < dealerCards.size(); i++)
        {
            dealerCards.get(i).draw(g);
            playerCards.get(i).draw(g);
        }
        hit.setLocation(10, 320);
        hit.setSize(100, 25);
        stand.setLocation(10, 350);
        stand.setSize(100, 25);
    }
    
    /**
     * Called by the browser or applet viewer to inform this JApplet that it
     * is being reclaimed and that it should destroy any resources that it
     * has allocated. The stop method will always be called before destroy. 
     */
    public void destroy()
    {
        // provide code to be run when JApplet is about to be destroyed.
    }

    /**
     * Returns information about this applet. 
     * An applet should override this method to return a String containing 
     * information about the author, version, and copyright of the JApplet.
     *
     * @return A String representation of information about this JApplet
     */
    public String getAppletInfo()
    {
        // provide information about the applet
        return "Blackjack\nCopyright 2015 Sam Saint-Pettersen";
    }

    /**
     * Returns parameter information about this JApplet. 
     * Returns information about the parameters that are understood by this JApplet.
     * An applet should override this method to return an array of Strings 
     * describing these parameters. 
     * Each element of the array should be a set of three Strings containing 
     * the name, the type, and a description.
     *
     * @return A String[] representation of parameter information about this JApplet
     */
    public String[][] getParameterInfo()
    {
        // provide parameter information about the applet
        String paramInfo[][] = {
                 {"ai",    "boolean",    "false"}
        };
        return paramInfo;
    }
}
