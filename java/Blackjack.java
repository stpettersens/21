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

public class Blackjack extends JPanel 
{
    private static boolean ai;
    private static boolean playing;
    private static int player_index;
    private static List<Card> player_cards;
    private static int dealer_index;
    private static List<Card> dealer_cards;
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
        dealer_pile.draw(g);
        for(int i = 0; i < dealer_cards.size(); i++)
        {
            dealer_cards.get(i).draw(g);
        }
        for(int i = 0; i < player_cards.size(); i++)
        {
            player_cards.get(i).draw(g);
        }
    }
    
    public static void main(String[] args)
    {
        Blackjack blackjack = new Blackjack();
        JFrame app = new JFrame();
        app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        app.add(blackjack);
        app.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        app.setTitle("Blackjack");
        app.setVisible(true);
        
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
        player_cards = new ArrayList<Card>();
        dealer_index = 2;
        dealer_cards = new ArrayList<Card>();
        
        player = new Player(DEBUG);
        dealer = new Dealer(DEBUG, cards);
        dealer_pile = new Card(cards.getImage("c"), 10, 10);
        
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
    }
}
