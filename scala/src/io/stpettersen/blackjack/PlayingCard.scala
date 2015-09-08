/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.awt.{Graphics, Image}

/**
 * Card implements a single playing card.
 * @param card
 * @param x
 * @param y
 */
class PlayingCard(card: Image, x: Int, y: Int) {

  private val this.card: Image = card
  private var posX: Int = x
  private var posY: Int = y

  /**
   * Set X, Y position for card.
   * @param x X position for card.
   * @param y Y position for card.
   */
  def setXY(x: Int, y: Int): Unit = {
    posX = x
    posY = y
  }

  /**
   * Get X, Y position of card.
   * @return X, Y co-ordinates of card.
   */
  def getXY: Array[Int] = {
    Array(posX, posY)
  }

  /**
   * Draw the card.
   */
  def draw(g: Graphics): Unit = {
    g.drawImage(card, posX, posY, null)
  }
}
