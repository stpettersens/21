/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import java.util.List;
import java.util.ArrayList;

public class Cards
{
    private int index;
    private int deck_num;
    private List<String> deck;
    private List<String> played;
    private String[] ranks;
    private String[] suits;

    /**
     * Card implements a collection of playing cards
     * and methods to draw and shuffle.
    */
    public Cards()
    {
        index = -1;
        deck_num = 52;
        deck = new ArrayList<String>();
        played = new ArrayList<String>();
        ranks = new String[] { "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };
        suits = new String[] { "h", "d", "c", "s" };
    }
    
    /**
     * Get image for card from string pattern.
     * @param card Card string pattern.
     * @return Relevant card image.
    */
    public String getImage(String card)
    {
        return "TODO";
    }
    
    /**
     * Get a rank for a card.
     * @return Card rank.
    */
   private String getRank()
   {
       int i = (int)Math.random() * ranks.length;
       return ranks[i];
   }
   
   /**
    * Get a suit for a card.
    * @return Card suit.
   */
   private String getSuit()
   {
       int i = (int)Math.random() * suits.length;
       return suits[i];
   }
   
   /**
    * Get a card.
    * @return Card as string.
   */
   private String getCard()
   {
       return String.format("%s %s", getRank(), getSuit());
   }
   
   /**
    * Shuffle cards.
   */
   public void shuffle()
   {
       index = -1;
       deck = new ArrayList<String>();
       played = new ArrayList<String>();
       while(true)
       {
           String card = getCard();
           if(!deck.contains(card))
           {
               deck.add(card);
               if(deck.size() == deck_num) break;
           }
       }
   }
   
   /**
    * Draw a card.
   */
   public String draw()
   {
       if(played.size() == deck_num || index == -1)
       {
           index = 0;           
       }
       String card = deck.get(index).replace(" ", "");
       played.add(card);
       return card;
   }
   
   /**
    * Get a card's value.
    * @return Card's value.
   */
   public int getValue()
   {
       String[] rs = deck.get(index).split(" ");
       index++;
       int val = 0;
       if(rs[0] == "A") val = 1;
       else if(rs[0] == "J" || rs[0] == "Q" || rs[0] == "K") val = 10;
       else val = Integer.parseInt(rs[0]);
       return val;
   }
   
   /**
    * Get number of played cards.
    * @return Number of cards played.
   */
   public int getPlayed()
   {
       return played.size();
   }
   
   public List<String> drawAll()
   {
       index = 0;
       List<String> draws = new ArrayList<String>();
       for(int i = 0; i < deck_num; i++)
       {
           draws.add(draw());
           index++;
       }
       index = -1;
       return draws;
   }
}
