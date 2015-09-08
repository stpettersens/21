/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack

trait IActor {
  def calcTotal: Int
  def hasBlackjack: Boolean
  def isBust: Boolean
  def showCards: Int
}
