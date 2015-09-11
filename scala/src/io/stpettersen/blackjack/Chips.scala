/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import io.stpettersen.blackjack.ChipColor.ChipColor

/**
 * Chip represents a collection of betting chips.
 */
class Chips {

  private var deck_white: Int = 0
  private var deck_red: Int = 0
  private var deck_blue: Int = 0
  private var deck_green: Int = 0
  private var deck_black: Int = 0
  private var amounts: Array[Int] = Array(1, 5, 10, 25, 100)

  /**
   * Get chip currency value from color.
   * @param color Color of the chip.
   * @return Chip value.
   */
  private def getChip(color: ChipColor): Int = {
    var value: Int = 0
    color match {
      case ChipColor.WHITE => value = amounts(0)
      case ChipColor.RED => value = amounts(1)
      case ChipColor.BLUE => value = amounts(2)
      case ChipColor.GREEN => value = amounts(3)
      case ChipColor.BLACK => value = amounts(4)
    }
    value
  }

  /**
   * Deal chips for a given betting balance.
   * @param balance Currency amount available to bet.
   */
  def deal(balance: Int): Unit = {
    deck_white = 0
    deck_red = 0
    deck_blue = 0
    deck_green = 0
    deck_black = 0
    Debugger.emit(true, s"Balance is \$$balance")
    // Deal out white chips
    var i: Int = 0
    for(i <- 0 to math.floor(balance / 1).asInstanceOf[Int]) {
      deck_white += 1
    }
    // Deal out red chips.
    i = 0
    for(i <- 0 to math.floor(balance / 5).asInstanceOf[Int]) {
      deck_red += 1
    }
    // Deal out blue chips.
    i = 0
    for(i <- 0 to math.floor(balance / 10).asInstanceOf[Int]) {
      deck_blue += 1
    }
    // Deal out green chips.
    i = 0
    for(i <- 0 to math.floor(balance / 25).asInstanceOf[Int]) {
      deck_green += 1
    }
    // Deal out black chips.
    i = 0
    for(i <- 0 to math.floor(balance / 100).asInstanceOf[Int]) {
      deck_black += 1
    }
  }

  /**
   * Draw a chip.
   * @param color Color of chosen chip.
   * @param balance Currency amount available to bet.
   * @return Chosen color, new balance.
   */
  def draw(color: ChipColor, balance: Int): Array[Int] = {
    if(balance > 0) {
      var bet: Int = 0
      if(color == ChipColor.WHITE && balance >= 1)
        bet = getChip(ChipColor.WHITE)
      else if(color == ChipColor.RED && balance >= 5)
        bet = getChip(ChipColor.RED)
      else if(color == ChipColor.BLUE && balance >= 10)
        bet = getChip(ChipColor.BLUE)
      else if(color == ChipColor.GREEN && balance >= 25)
        bet = getChip(ChipColor.GREEN)
      else if(color == ChipColor.BLACK && balance >= 100)
        bet = getChip(ChipColor.BLACK)

      val newBalance: Int = balance - bet
      Array(color, newBalance)
    }
    Array(-1, 0)
  }

  /**
   * Get number of available chips.
   * @return Numbers of each color chip.
   */
  def getNums: Array[Int] = {
    Array(deck_white, deck_red, deck_blue, deck_green, deck_black)
  }
}
