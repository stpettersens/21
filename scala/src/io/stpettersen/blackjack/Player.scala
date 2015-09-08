/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack

/**
 * Player implements the player for Blackjack.
 * @param debug Enable debug messages?
 */
class Player(debug: Boolean) extends Actor(debug) {

  /**
   * Player hits.
   * @param cards Game cards.
   * @return Player's drawn card.
   */
  def hit(cards: Cards): PlayingCard = {
    var card: String = cards.draw
    this.cards.add(card)
    values.add(cards.getValue)
    index += 1
    pos += 90
    Debugger.emit(debug, "Player hits.")
    Debugger.emit(debug, "Player gets " + card)
    Debugger.emit(debug, s"Player has $calcTotal")
    new PlayingCard(cards.getImage(card), pos, 310)
  }

  /**
   * Player stands.
   */
  override def stand(): Unit = {
    Debugger.emit(debug, "Player stands.")
    Debugger.emit(debug, s"Player has $calcTotal")
  }

  /**
   * Determine if player has Blackjack.
   * @return Does actor have Blackjack?
   */
  override def hasBlackjack: Boolean = {
    if(super.hasBlackjack) {
      Debugger.emit(debug, "Player has Blackjack!");
    }
    super.hasBlackjack
  }

  /**
   * Determine if player is bust.
   * @return Is actor bust?
   */
  override def isBust: Boolean = {
    if(super.isBust) {
      Debugger.emit(debug, "Player is bust!")
    }
    super.isBust
  }

  /**
   * Show player's cards.
   * @return Total value of actor's cards.
   */
  override def showCards: Int = {
    Debugger.emit(debug, "\nPlayer has:")
    super.showCards
  }

  /**
   * Receive cards from dealer.
   * @param cards Game cards.
   * @param player_cards Player's cards as Array[String].
   * @return Player's cards as Array[PlayingCard].
   */
  def receiveCards(cards: Cards, player_cards: Array[String]): Array[PlayingCard] = {
    var pc: String = ""
    var i: Int = 0
    for(i <- 0 to player_cards.length - 1) {
      val cv: Array[String] = player_cards(i).split(" ")
      this.cards.add(cv(0))
      values.add(Integer.parseInt(cv(1)))
    }
    pc = String.format("[%s][%s]", this.cards.get(0), this.cards.get(1))
    Debugger.emit(debug, "\nPlayer receives ther cards:")
    Debugger.emit(debug, s"$pc --> $calcTotal")

    val cardA = new PlayingCard(cards.getImage(this.cards.get(index)), pos, 310)
    pos += 90
    index += 1
    val cardB = new PlayingCard(cards.getImage(this.cards.get(index)), pos, 310)
    Array(cardA, cardB)
  }
}
