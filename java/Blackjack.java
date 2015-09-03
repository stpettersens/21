/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.ImageIcon;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.BorderLayout;

public class Blackjack extends JPanel 
{
    private static boolean ai;
    private static boolean playing;
    private static int player_index;
    private static Card[] player_cards;
    private static int dealer_index;
    private static Card[] dealer_cards;
    private static Screentip screentip;
    private static Score score;
    private static Score instruction;
    private static Score p_score;
    private static Score d_score;
    private static Card dealer_pile;
    private static Cards cards;
    private static Player player;
    private static Dealer dealer;
    private static SoundEffects soundEffects;
    
    private static final int SCREEN_WIDTH = 780;
    private static final int SCREEN_HEIGHT = 500;
    private static final int CARD_LIMIT = 42;
    private static final boolean DEBUG = true;
     
    public Blackjack() 
    {
        super(); 
        setBackground(new Color(0, 153, 0));
        ai = false;
        playing = false;
        Debugger.emit(DEBUG, "Initialized Blackjack (Java Swing/AWT).");
    }
    
    public void paint(Graphics g)
    {
        int width = getWidth();
        int height = getHeight();
        super.paint(g);
    }
    
    public static void main(String[] args)
    {
        /*Blackjack blackjack = new Blackjack();
        JFrame app = new JFrame();
        app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        app.add(blackjack);
        app.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        app.setTitle("Blackjack");
        app.setVisible(true);*/
        
        screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 50), 190);
        instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 155), 450);
        p_score = new Score(DEBUG, 153, 315);
        d_score = new Score(DEBUG, 153, 25);
        cards = new Cards();
        soundEffects = new SoundEffects();
        newGame();
    }
    
    private static void newGame()
    {
        playing = true;
        player_index = 2;
        player_cards = new Card[5];
        dealer_index = 2;
        dealer_cards = new Card[5];
        
        player = new Player(DEBUG);
        dealer = new Dealer(DEBUG, cards);
        dealer_pile = new Card(cards.getImage("c"), 10, 10);
        
        if(cards.getPlayed() == 0 || cards.getPlayed() >= CARD_LIMIT)
        {
            dealer.shuffle();
        }
        
        screentip.clear();
        player_cards = player.receiveCards(cards, dealer.deal(cards));
        dealer_cards = dealer.receiveCards(cards);
        player_cards[2] = new Card(cards.getImage("d"), 405, 310);
        player_cards[3] = new Card(cards.getImage("d"), 495, 310);
        player_cards[4] = new Card(cards.getImage("d"), 585, 310);
        dealer_cards[2] = new Card(cards.getImage("d"), 405, 10);
        dealer_cards[3] = new Card(cards.getImage("d"), 495, 10);
        dealer_cards[4] = new Card(cards.getImage("d"), 585, 10);
        
        Debugger.emit(DEBUG, player_cards);
        Debugger.emit(DEBUG, "GOT HERE!");
        
    }
}
