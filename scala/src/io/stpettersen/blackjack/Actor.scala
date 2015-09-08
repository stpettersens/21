/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import scala.collection.mutable.MutableList

/**
 * Actor implements the common player/dealer for Blackjack.
 * @param debug Enable debug messages?
 * @param gameCards Game cards.
 */
class Actor(debug: Boolean, gameCards: Cards, soundEffects: SoundEffects) extends IActor {

  protected var this.debug: Boolean = debug
  protected var index: Int = 0
  protected var pos: Int = 225
  protected var cards: MutableList[String] = MutableList()
  protected var values: MutableList[Int] = MutableList()
  protected var this.gameCards: Cards = gameCards
  protected var this.soundEffects: SoundEffects = soundEffects

  def this(debug: Boolean) = this(debug, null, null)

  /**
   * Calculate the total value of actor's held cards.
   * @return Total value of actor's cards.
   */
  def calcTotal(): Int = {
    values.sortWith(_ < _)
    var total: Int = 0
    var i: Int = 0
    for(i <- 0 to values.length) {
      var v: Int = values(i)
      if(v == 1) {
        if((total + 11) <= 21) v = 11
        else if((total + 11) > 21) v = 1
      }
      total += v
    }
    total
  }

  /**
   * Actor stands.
   */
  protected def stand: Unit = {}

  /**
   * Determine if actor has Blackjack.
   * @return Does actor have Blackjack?
   */
  def hasBlackjack: Boolean = {
    var blackjack: Boolean = false
    if(calcTotal() == 21) {
      blackjack = true
    }
    blackjack
  }

  /**
   * Determine if actor is bust.
   * @return Is actor bust?
   */
  def isBust: Boolean = {
    var bust: Boolean = false
    if(calcTotal() > 21) {
      bust = true
    }
    bust
  }

  /**
   * Show actor's cards
   * @return Total value of actor's cards.
   */
  def showCards(): Int = {
    index = 0
    pos = 225
    var cards: String = ""
    var i: Int = 0
    for(i <- 0 to this.cards.length) {
      cards += String.format("[%s]", this.cards(i))
    }
    Debugger.emit(debug, String.format("%s --> %d", cards, calcTotal()))
    calcTotal()
  }

  /**
   * Play sound effect.
   * @param effect Name of sound effect to play.
   */
  protected def playSoundEffect(effect: String): Unit = {
    if(soundEffects != null) {
      soundEffects.play(effect)
    }
  }
}
