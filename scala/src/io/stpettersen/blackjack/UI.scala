/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.awt.{Graphics,Color,Font}

class UI extends IUI {

  /**
   * Clear a UI item.
   */
  def clear: Unit = {}

  /**
   * Draw a UI item.
   * @param g Graphics object.
   */
  def draw(g: Graphics): Unit = {
    g.setColor(Color.WHITE)
    g.setFont(new Font("Verdana", Font.PLAIN, 12))
  }
}
