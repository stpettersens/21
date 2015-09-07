/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import java.util.List;
import java.util.ArrayList;
import java.awt.Graphics;
import java.awt.Color;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JRootPane;

public class BlackjackApplet extends JApplet
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
    private SoundEffects soundEffects;
    private JButton hit;
    private JButton stand;
    
    private final int SCREEN_WIDTH = 780;
    private final int SCREEN_HEIGHT = 500;
    private final int CARD_LIMIT = 42;
    private final boolean DEBUG = true;

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
        soundEffects = new SoundEffects();
        dealer_pile = new Card(cards.getImage("c"), 10, 10);
        
        hit = new JButton("Hit");
        stand = new JButton("Stand");
        
        //hit.setBounds(10,320,100,25);
        //stand.setBounds(10,350,100,25);
        
        //this.add(hit);
        //this.add(stand);
        
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
    
    private void newGame()
    {
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
     * Paint method for applet.
     * 
     * @param  g   the Graphics object for this applet
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
    }
    
    /**
     * Update logic.
    */
   private void update()
   {
       // Determine if a Blackjack or bust has occurred?
       /*if(hasBlackjack() || isBust())
       {
           showCards();
       }*/
       p_score.emit(player.calcTotal());
       
       if(playing)
       {
           d_score.emit("?");
           instruction.emit("Hit or Stand?");
        }
        repaint();
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
     * @return a String representation of information about this JApplet
     */
    public String getAppletInfo()
    {
        // provide information about the applet
        return "Blackjack\nCopyright 2015 Sam Saint-Pettersen";
    }


    /**
     * Returns parameter information about this JApplet. 
     * Returns information about the parameters than are understood by this JApplet.
     * An applet should override this method to return an array of Strings 
     * describing these parameters. 
     * Each element of the array should be a set of three Strings containing 
     * the name, the type, and a description.
     *
     * @return a String[] representation of parameter information about this JApplet
     */
    public String[][] getParameterInfo()
    {
        // provide parameter information about the applet
        String paramInfo[][] = {
                 {"firstParameter",    "1-10",    "description of first parameter"},
                 {"status", "boolean", "description of second parameter"},
                 {"images",   "url",     "description of third parameter"}
        };
        return paramInfo;
    }
}
