/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.util.{Comparator, Collections, List => JList, ArrayList => JArrayList}

/**
 * Actor implements the common player/dealer for Blackjack.
 * @param debug Enable debug messages?
 * @param gameCards Game cards.
 */
class Actor(debug: Boolean, gameCards: Cards) extends IActor {

  protected var this.debug: Boolean = debug
  protected var index: Int = 0
  protected var pos: Int = 225
  protected var cards: JList[String] = new JArrayList[String]()
  protected var values: JList[Int] = new JArrayList[Int]()
  protected var this.gameCards: Cards = gameCards

  def this(debug: Boolean) = this(debug, null)

  /**
   * Calculate the total value of actor's held cards.
   * @return Total value of actor's cards.
   */
  def calcTotal: Int = {
    val cmp: Comparator[Int] = Collections.reverseOrder()
    Collections.sort(values, cmp)
    var total: Int = 0
    var i: Int = 0
    for(i <- 0 to values.size() - 1) {
      var v: Int = values.get(i)
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
  protected def stand(): Unit = {}

  /**
   * Determine if actor has Blackjack.
   * @return Does actor have Blackjack?
   */
  def hasBlackjack: Boolean = {
    var blackjack: Boolean = false
    if(calcTotal == 21) {
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
    if(calcTotal > 21) {
      bust = true
    }
    bust
  }

  /**
   * Show actor's cards
   * @return Total value of actor's cards.
   */
  def showCards: Int = {
    index = 0
    pos = 225
    var cards: String = ""
    var i: Int = 0
    for(i <- 0 to this.cards.size()) {
      cards += s"[$this.cars.get(i)]"
    }
    Debugger.emit(debug, s"$cards --> $calcTotal")
    calcTotal
  }

  /**
   * Play sound effect.
   * @param effect Name of sound effect to play.
   */
  protected def playSoundEffect(effect: String): Unit = {
    SoundEffects.play(effect)
  }
}
