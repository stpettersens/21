/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.awt.Image
import java.awt.image.BufferedImage
import java.io.{File, IOException}
import javax.imageio.ImageIO

import scala.collection.mutable.MutableList

/**
 * Card implements a collection of playing cards
 * and methods to draw and shuffle.
 */
class Cards {

  private var index: Int = -1
  private val deck_num: Int = 52
  private var deck: MutableList[String] = MutableList()
  private var played: MutableList[String] = MutableList()
  private val ranks: List[String]
  = List("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")
  private val suits: List[String] = List("h", "d", "c", "s")
  private var str_images: MutableList[String] = MutableList("c", "d")
  private var images: MutableList[Image] = MutableList()

  var i: Int = 0
  for(i <- 0 to ranks.length) {
    str_images += suits(0) + ranks(i)
    str_images += suits(1) + ranks(i)
    str_images += suits(2) + ranks(i)
    str_images += suits(3) + ranks(i)
  }

  i = 0
  for(i <- 0 to str_images.length) {
    var img: BufferedImage = null
    try {
      img = ImageIO.read(new File(String.format("graphics/%s.png", str_images(i))))
      images += img
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
    if(pos != -1) img = images(pos)
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
  def shuffle: Unit = {
    index = -1
    deck = MutableList()
    played = MutableList()
    var shuffling = true
    while(shuffling) {
      val card: String = getCard
      if(!deck.contains(card)) {
        deck += card
        if(deck.length == deck_num)
          shuffling = false
      }
    }
  }

  /**
   * Draw a card.
   * @return Drawn card.
   */
  def draw(): String = {
    if(played.length == deck_num || index == -1)
      index = 0

    val card: String = deck(index).replace(" ", "")
    played += card
    card
  }

  /**
   * Get a card's value.
   * @return Card's value.
   */
  def getValue: Int = {
    val rs: Array[String] = deck(index).split(" ")
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
  def getPlayed(): Int = {
    played.length
  }

  /**
   * Draw all cards from the deck.
   * @return All cards from deck.
   */
  def drawAll(): MutableList[String] = {
    index = 0
    var draws: MutableList[String] = MutableList()
    var i: Int = 0
    for(i <- 0 to deck_num) {
      draws += draw()
      index++
    }
    index = -1
    draws
  }
}
