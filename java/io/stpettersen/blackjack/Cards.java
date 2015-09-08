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
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public class Cards
{
    private int index;
    private int deck_num;
    private List<String> deck;
    private List<String> played;
    private String[] ranks;
    private String[] suits;
    private List<String> str_images;
    private List<Image> images;

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
        str_images = new ArrayList<String>();
        images = new ArrayList<Image>();
        str_images.add("c");
        str_images.add("d");
        for(int i = 0; i < ranks.length; i++)
        {
            str_images.add(suits[0] + ranks[i]);
            str_images.add(suits[1] + ranks[i]);
            str_images.add(suits[2] + ranks[i]);
            str_images.add(suits[3] + ranks[i]);
        }
        for(int i = 0; i < str_images.size(); i++)
        {
            BufferedImage img = null;
            try
            {
                img = ImageIO.read(new File(String.format("graphics/%s.png", str_images.get(i))));
                images.add(img);
            }
            catch(IOException e)
            {
                System.out.println(e);
            }
        }
    }
    
    /**
     * Get image for card from string pattern.
     * @param card Card string pattern.
     * @return Relevant card image or null.
    */
    public Image getImage(String card)
    {
        String pattern = new StringBuilder(card).reverse().toString();
        if(pattern.length() > 1 && pattern.charAt(1) == '0')
        {
            pattern = pattern.charAt(0) + "10";
        }
        int pos = str_images.indexOf(pattern);
        Image img = null;
        if(pos != -1) img = images.get(pos);
        return img;
    }
    
    /**
     * Get a rank for a card.
     * @return Card rank.
    */
   private String getRank()
   {
       int i = (int)Math.floor(Math.random() * ranks.length);
       return ranks[i];
   }
   
   /**
    * Get a suit for a card.
    * @return Card suit.
   */
   private String getSuit()
   {
       int i = (int)Math.floor(Math.random() * suits.length);
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
       if(rs[0].equals("A")) 
       {
           val = 1;
       }
       else if(rs[0].equals("J") || rs[0].equals("Q") || rs[0].equals("K"))
       {
           val = 10;
       }
       else 
       {
           val = Integer.parseInt(rs[0]);
       }
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
   
   /**
    * Draw all cards from the deck.
    * @return All cards from deck.
   */
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
