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
import javax.swing.JButton;
import javax.swing.JRootPane;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class BlackjackApplet extends JApplet implements ActionListener
{
    private boolean ai;
    private boolean playing;
    private int player_index;
    private List<Card> player_cards;
    private int dealer_index;
    private List<Card> dealer_cards;
    private Screentip screentip;
    private Score score;
    private Score instruction;
    private Score p_score;
    private Score d_score;
    private Card dealer_pile;
    private Cards cards;
    private Player player;
    private Dealer dealer;
    private JButton hit;
    private JButton stand;
    
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
        screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 50), 190);
        instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 155), 450);
        p_score = new Score(DEBUG, 153, 315);
        d_score = new Score(DEBUG, 153, 25);
        cards = new Cards();
        dealer_pile = new Card(cards.getImage("c"), 10, 10);
        hit = new JButton("Hit");
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
        newGame();
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
     * Start a new game.
     */
    private void newGame()
    {
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
        playing = false;
        dealer_cards.set(0, dealer.revealFirstCard(cards));
        int ds = dealer.showCards();
        int ps = player.showCards();
        
        if(ps == 21 && ds != 21)
        {
            screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
        }
        else if(ds == 21 && ps != 21)
        {
            screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
        }
        else if((ps == ds) || (ps > 21 && ds > 21))
        {
            screentip.emit("PUSH", "Neither dealer nor player won.");
        }
        else if(ps <= 21 && ps > ds)
        {
            screentip.emit("PLAYER WINS", String.format("Player wins with %d. Well done.", ps));
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
        }
        
        d_score.emit(dealer.calcTotal());
        Debugger.emit(DEBUG, String.format("Cards played %d", cards.getPlayed()));
        
        if(cards.getPlayed() >= CARD_LIMIT)
        {
            instruction.emit("Dealer is shuffling cards...");
        }
        else
        {
            instruction.emit("Play again? Press Hit or Stand.");
        }
        
        if(cards.getPlayed() == 52)
        {
            dealer_pile = new Card(cards.getImage("d"), 10, 10);
        }
        repaint();
    }
    
    /**
     * Update logic.
    */
    private void update()
    {
        // Determine if a Blackjack or bust has occurred?
        if(hasBlackjack() || isBust() || player_index == 5)
        {
            showCards();
        }
        p_score.emit(player.calcTotal());
        
        if(playing)
        {
            d_score.emit("?");
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
            player_cards.set(player_index, player.hit(cards));
            int[] xy = player_cards.get(player_index).getXY();
            Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy[0], xy[1]));
            player_index++;
            repaint();
        }
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
     * @param e ActionEvent.
    */
    public void actionPerformed(ActionEvent e)
    {
        Object src = e.getSource();
        if(src == hit)
        {
            if(playing) hit();
            else newGame();
        }
        else if(src == stand)
        {
            if(playing) stand();
            else newGame();
        }
        update();
    }

    /**
     * Paint method for applet.
     * @param g Graphics object for this applet
     */
    public void paint(Graphics g)
    {
        g.setColor(new Color(0, 153, 0));
        g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        dealer_pile.draw(g);
        screentip.draw(g);
        instruction.draw(g);
        p_score.draw(g);
        d_score.draw(g);
        for(int i = 0; i < dealer_cards.size(); i++)
        {
            dealer_cards.get(i).draw(g);
            player_cards.get(i).draw(g);
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
