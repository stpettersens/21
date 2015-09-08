/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.util.{List => JList, ArrayList => JArrayList}

/**
 * Dealer implements the dealer for Blackjack.
 * @param debug Enable debug messages?
 * @param gameCards Game cards.
 * @param soundEffects Sound effects.
 */
class Dealer(debug: Boolean, gameCards: Cards, soundEffects: SoundEffects) extends
Actor(debug, gameCards, soundEffects) {

  def this(debug: Boolean, gameCards: Cards) = this(debug, gameCards, null)

  /**
   * Dealer hits.
   * @param cards Game cards.
   * @return Dealer's drawn card.
   */
  private def hit(cards: Cards): PlayingCard = {
    val card: String = cards.draw
    this.cards.add(card)
    values.add(cards.getValue)
    index += 1
    pos = 90
    Debugger.emit(debug, "Dealer hits.")
    Debugger.emit(debug, "Dealer gets " + card)
    Debugger.emit(debug, s"Dealer has $calcTotal")
    new PlayingCard(cards.getImage(card), pos, 10)
  }

  /**
   * Dealer stands.
   */
  protected override def stand(): Unit = {
    Debugger.emit(debug, "Dealer stands.")
  }

  /**
   * Dealer shuffles.
   */
  def shuffle(): Unit = {
    playSoundEffect("shuffle")
    Debugger.emit(debug, "----------------------------------------------------")
    Debugger.emit(debug, "Dealer is shuffling cards...")
    Debugger.emit(debug, "----------------------------------------------------")
    gameCards.shuffle()
  }

  /**
   * Dealer deals.
   * @param cards Game cards.
   * @return Player's cards.
   */
  def deal(cards: Cards): Array[String] = {
    playSoundEffect("deal")
    var dealt: JList[String] = new JArrayList[String]()
    var i: Int = 1
    Debugger.emit(debug, "----------------------------------------------------")
    Debugger.emit(debug, "Dealer is dealing cards for a new game...")
    Debugger.emit(debug, "----------------------------------------------------")
    while(i <= (2 * 2)) {
      dealt.add(cards.draw + " " + cards.getValue)
      i += 1
    }
    i = 0
    while(i < 2) {
      val cv: Array[String] = dealt.get(i).split(" ")
      this.cards.add(cv(0))
      values.add(Integer.parseInt(cv(1)))
      i += 1
    }
    Debugger.emit(debug, "\nDealer has:")
    Debugger.emit(debug, String.format("[**][%s]", this.cards.get(1)))
    Array(dealt.get(2), dealt.get(3))
  }

  /**
   * Determine if dealer has Blackjack.
   * @return Does actor have Blackjack?
   */
  override def hasBlackjack: Boolean = {
    if(super.hasBlackjack) {
      Debugger.emit(debug, "Dealer has Blackjack!")
    }
    super.hasBlackjack
  }

  /**
   * Determine if dealer is bust.
   * @return Is actor bust?
   */
  override def isBust: Boolean = {
    if(super.isBust) {
      Debugger.emit(debug, "Dealer is bust!")
    }
    super.isBust
  }

  /**
   * Dealer responds to player action (e.g. a hit or stand).
   * @param cards Game cards.
   * @return Cards returned.
   */
  def respond(cards: Cards): JList[PlayingCard] = {
    showCards
    var responding: Boolean = true
    var inner = responding
    var response_cards: JList[PlayingCard] = new JArrayList[PlayingCard]()
    while(responding) {
      var total: Int = 0
      while(total <= 18 || inner) {
        total = calcTotal
        if(total == 16) {
          if(math.floor(math.random * 6) >= 3) {
            response_cards.add(hit(cards)) // Take risk.
          }
          else {
            stand // Play it safe.
          }
        }
        else if(total >= 17) {
          stand
          responding = false
          inner = responding
        }
        else {
          response_cards.add(hit(cards))
        }
      }
    }
    response_cards
  }

  /**
   * Show dealer's cards.
   * @return Total value of dealer's cards.
   */
  override def showCards: Int = {
    Debugger.emit(debug, "\nDealer has:")
    super.showCards
  }

  /**
   * Dealer receives cards.
   * @param cards Game cards.
   * @return Dealer's received cards.
   */
  def receiveCards(cards: Cards): Array[PlayingCard] = {
    val cardA = new PlayingCard(cards.getImage("c"), pos, 10)
    pos += 90
    val cardB = new PlayingCard(cards.getImage(this.cards.get(1)), pos, 10)
    index += 2
    Array(cardA, cardB)
  }

  /**
   * Dealer reveals first card.
   * @param cards Game cards.
   * @return Revealed first card.
   */
  def revealFirstCard(cards: Cards): PlayingCard = {
    playSoundEffect("reveal")
    new PlayingCard(cards.getImage(this.cards.get(0)), 225, 10)
  }
}
