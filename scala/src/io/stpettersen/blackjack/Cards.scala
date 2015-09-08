/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.util.{List => JList, ArrayList => JArrayList}
import java.awt.Image
import java.awt.image.BufferedImage
import java.io.{File, IOException}
import java.util
import javax.imageio.ImageIO

/**
 * Card implements a collection of playing cards
 * and methods to draw and shuffle.
 */
class Cards {

  private var index: Int = -1
  private val deck_num: Int = 52
  private var deck: JList[String] = new JArrayList[String]()
  private var played: JList[String] = new JArrayList[String]()
  private val ranks: Array[String] = Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")
  private val suits: Array[String] = Array("h", "d", "c", "s")
  private val str_images: JList[String] = new JArrayList[String]()
  private val images: JList[Image] = new JArrayList[Image]()

  str_images.add("c")
  str_images.add("d")
  var i: Int = 0
  for(i <- 0 to ranks.length - 1) {
    str_images.add(suits(0) + ranks(i))
    str_images.add(suits(1) + ranks(i))
    str_images.add(suits(2) + ranks(i))
    str_images.add(suits(3) + ranks(i))
  }

  i = 0
  for(i <- 0 to str_images.size() - 1) {
    var img: BufferedImage = null
    try {
      img = ImageIO.read(new File(String.format("graphics/%s.png", str_images.get(i))))
      images.add(img)
    }
    catch {
      case ioe: IOException => println(ioe)
    }
  }

  /**
   * Get image for card from string pattern.
   * @param card Card string pattern.
   * @return Relevant card image or null.
   */
  def getImage(card: String): Image = {
    var pattern: String = new StringBuilder(card).reverse.toString
    if(pattern.length() > 1 && pattern.charAt(1) == '0') {
      pattern = pattern.charAt(0) + "10"
    }
    val pos: Int = str_images.indexOf(pattern)
    var img: Image = null
    if(pos != -1) img = images.get(pos)
    img
  }

  /**
   * Get a rank for a card.
   * @return Card rank.
   */
  private def getRank: String = {
    val i: Int = math.floor(math.random * ranks.length).asInstanceOf[Int]
    ranks(i)
  }

  /**
   * Get a suite for a card.
   * @return Card suit.
   */
  private def getSuit: String = {
    val i: Int = math.floor(math.random * suits.length).asInstanceOf[Int]
    suits(i)
  }

  /**
   * Get a card.
   * @return Card as string.
   */
  private def getCard: String = {
    String.format("%s %s", getRank, getSuit)
  }

  /**
   * Shuffle cards.
   */
  def shuffle(): Unit = {
    index = -1
    deck = new JArrayList[String]()
    played = new JArrayList[String]()
    var shuffling = true
    while(shuffling) {
      val card: String = getCard
      if(!deck.contains(card)) {
        deck.add(card)
        if(deck.size() == deck_num)
          shuffling = false
      }
    }
  }

  /**
   * Draw a card.
   * @return Drawn card.
   */
  def draw: String = {
    if(played.size() == deck_num || index == -1)
      index = 0

    val card: String = deck.get(index).replace(" ", "")
    played.add(card)
    card
  }

  /**
   * Get a card's value.
   * @return Card's value.
   */
  def getValue: Int = {
    val rs: Array[String] = deck.get(index).split(" ")
    index += 1
    var value: Int = 0
    if(rs(0).equals("A"))
      value = 1
    else if(rs(0).equals("J") || rs(0).equals("Q") || rs(0).equals("K"))
      value = 10
    else  value = Integer.parseInt(rs(0))
    value
  }

  /**
   * Get number of played cards.
   * @return Number of cards played.
   */
  def getPlayed: Int = {
    played.size()
  }

  /**
   * Draw all cards from the deck.
   * @return All cards from deck.
   */
  def drawAll: JList[String] = {
    index = 0
    val draws: JList[String] = new JArrayList[String]()
    var i: Int = 0
    for(i <- 0 to deck_num) {
      draws.add(draw)
      index += 1
    }
    index = -1
    draws
  }
}
