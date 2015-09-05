/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import java.util.List;
import java.util.ArrayList;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.ImageIcon;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.BorderLayout;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

public class Blackjack extends JPanel implements KeyListener
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
    private boolean loaded;
    
    private static final int SCREEN_WIDTH = 780;
    private static final int SCREEN_HEIGHT = 500;
    private final int CARD_LIMIT = 42;
    private final boolean DEBUG = true;
     
    /**
     * Blackjack implements the game itself.
    */
    public Blackjack() 
    {
        super(); 
        setBackground(new Color(0, 153, 0));
        ai = false;
        playing = false;
        screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 50), 190);
        instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 155), 450);
        p_score = new Score(DEBUG, 153, 315);
        d_score = new Score(DEBUG, 153, 25);
        cards = new Cards();
        soundEffects = new SoundEffects();
        dealer_pile = new Card(cards.getImage("c"), 10, 10);
        Debugger.emit(DEBUG, "Initialized Blackjack (Java Swing/AWT).");
    }
    
    /**
     * Start a new game.
    */
    public void newGame() 
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
            instruction.emit("Dealer is shuffling cards... [Press Y key]");
        }
        else
        {
            instruction.emit("Play again? Yes [Y key] or N [N key]");
        }
        
        if(cards.getPlayed() == 52)
        {
            dealer_pile = new Card(cards.getImage("d"), 10, 10);
        }
    }
    
    /**
     * Update logic.
    */
    private void update()
    {
        // Determine if a Blackjack or bust has occurred?
        if(hasBlackjack() || isBust())
        {
            showCards();
        }
        p_score.emit(player.calcTotal());
        
        if(playing)
        {
            d_score.emit("?");
            instruction.emit("Hit [H key] or Stand [S key]?");
        }
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
            soundEffects.play("hit");
            player_cards.set(player_index, player.hit(cards));
            int[] xy = player_cards.get(player_index).getXY();
            Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy[0], xy[1]));
            player_index++;
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
            Debugger.emit(DEBUG, String.format("Added image at %d,%d", xy[0], xy[1]));
            Debugger.emit(DEBUG, dealer_index);
        }
        showCards();
    }
    
    /**
     * Bring up project's repository on GitHub.
    */
    private void viewGitHubRepo()
    {
        // TODO.
    }
    
    /**
     * Draw elements to game window.
    */
    public void paint(Graphics g)
    {
        int width = getWidth();
        int height = getHeight();
        super.paint(g);
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
    
    private void updateInput(KeyEvent e, String status)
    {
        System.out.println(status);
    }
    
    public void keyTyped(KeyEvent e)
    {
        updateInput(e, "TYPED");
    }
    
    public void keyPressed(KeyEvent e)
    {
        updateInput(e, "PRESSED");
    }
    
    public void keyReleased(KeyEvent e)
    {
        updateInput(e, "RELEASED");
    }
    
    /**
     * Entry method for game.
     * @param args Command line arguments.
    */
    public static void main(String[] args)
    {
        Blackjack blackjack = new Blackjack();
        JFrame app = new JFrame();
        app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        app.add(blackjack);
        app.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        app.setTitle("Blackjack");
        app.setVisible(true);
        app.setResizable(false);
        
        blackjack.newGame();
    }
}
