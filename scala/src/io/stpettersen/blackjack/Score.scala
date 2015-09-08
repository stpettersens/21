/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.awt.Graphics

/**
 * Score implements a score or information box.
 * @param debug Enable debug messages?
 * @param x X position for score box.
 * @param y Y position for score box.
 */
class Score(debug: Boolean, x: Int, y: Int) extends UI {

  private var score: String = ""
  private val posX: Int = x
  private val posY: Int = y
  Debugger.emit(debug, s"Created score counter at $posX,$posY")

  /**
   * Emit a score or similar message.
   * @param message Score or similar message to emit.
   */
  def emit(message: String): Unit = {
    clear
    score = message
  }

  /**
   * Emit the score or other integer value.
   * @param score Score to emit.
   */
  def emit(score: Int): Unit = {
    emit(Integer.toString(score))
  }

  /**
   * Clear the score box.
   */
  override def clear: Unit = {
    score = ""
  }

  /**
   * Draw the score box.
   */
  override def draw(g: Graphics): Unit = {
    super.draw(g)
    g.drawString(score, posX, posY)
  }
}
