/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack

object Debugger {

  /**
   * Emit a debug message.
   * @param debug Enable debug?
   * @param message String to emit.
   */
  def emit(debug: Boolean, message: String): Unit = {
    if(debug) println(message)
  }

  /**
   * Emit a debug message.
   * @param debug Enable debug?
   * @param integer Integer to emit.
   */
  def emit(debug: Boolean, integer: Int): Unit = {
    emit(debug, Integer.toString(integer))
  }
}
