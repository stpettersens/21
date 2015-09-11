/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
*/

package io.stpettersen.blackjack
import java.util.{List => JList, ArrayList => JArrayList}
import java.io.IOException
import org.newdawn.easyogg.OggClip

/**
 * SoundEffects implements playing game sound effects.
 */
object SoundEffects extends ISoundEffects {

  private val strEffects: Array[String] = Array("deal", "shuffle", "hit", "reveal")
  private val effects: JList[OggClip] = new JArrayList[OggClip]()
  private var soundOn: Boolean = true

  def init(): Unit = {
    var i: Int = 0
    for(i <- 0 to strEffects.length - 1) {
      try {
        effects.add((null)) //new OggClip(String.format("sounds/%s.ogg", strEffects(i))))
      }
      catch {
        case ioe: IOException => ioe.printStackTrace()
      }
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
      //effects.get(strEffects.indexOf(effect)).play()
    }
  }
}
