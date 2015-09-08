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
 * Screentip implements a title and message box.
 * @param debug Enable debug messages?
 * @param x X position for screentip.
 * @param y Y position for screentip.
 */
class Screentip(debug: Boolean, x: Int, y: Int) extends UI {

  private val posX: Int = x
  private val posY: Int = y
  private var title: String = ""
  private var msg: String = ""
  Debugger.emit(debug, s"Created screentip at $posX,$posY")

  /**
   * Emit a title and message.
   * @param title Title to emit.
   * @param message Message to emit.
   */
  def emit(title: String, message: String): Unit = {
    clear
    this.title = title
    msg = message
  }

  /**
   * Clear the screentip.
   */
  override def clear: Unit = {
    title = ""
    msg = ""
  }

  /**
   * Draw the screentip.
   * @param g Graphics object.
   */
  override def draw(g: Graphics): Unit = {
    if(title == null || msg == null) {
      clear
    }
    super.draw(g)
    g.drawString(title, posX, posY)
    g.drawString(msg, (posX - 45), (posY + 20))
  }
}
