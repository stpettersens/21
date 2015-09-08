/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
*/

package io.stpettersen.blackjack
import scala.collection.mutable.MutableList
import java.io.IOException
import org.newdawn.easyogg.OggClip

/**
 * SoundEffects implements playing game sound effects.
 */
class SoundEffects extends ISoundEffects {

  private val strEffects: List[String] = List("deal", "shuffle", "hit", "reveal")
  private var effects: MutableList[OggClip] = MutableList()
  private var soundOn: Boolean = true
  private val s: String = "sounds/"

  var i: Int = 0;
  for(i <- 0 to strEffects.length) {
    try {
      effects += new OggClip(String.format("%s.%s.ogg", s, strEffects(i)))
    }
    catch {
      case ioe: IOException => ioe.printStackTrace()
    }
  }

  /**
   * Toggle sound effects on/off.
   * @return Are sound effects on?
   */
  def toggle: Boolean = {
    if(soundOn) soundOn = false
    else soundOn = true
    soundOn
  }

  /**
   * Play a sound effect.
   * @param effect Name of sound effect to play.
   */
  def play(effect: String): Unit = {
    if(soundOn) {
      effects(strEffects.indexOf(effect)).play()
    }
  }
}
