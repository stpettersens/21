/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.awt.Graphics

trait IUI {
  def clear: Unit
  def draw(g: Graphics): Unit
}
