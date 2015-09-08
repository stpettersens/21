/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack

import java.util.{List => JList, ArrayList => JArrayList}
import javax.swing.{JFrame, JPanel, JButton}
import java.awt.{Graphics, Color}
import java.awt.event.{ActionEvent, ActionListener}

/**
 * Blackjack implements the game itself.
 */
class Blackjack extends JPanel with ActionListener {

  private val ai: Boolean = false
  private var playing: Boolean = false
  private var player_index: Int = 2
  private var player_cards: JArrayList[PlayingCard] = new JArrayList[PlayingCard]()
  private var dealer_index: Int = 2
  private var dealer_cards: JArrayList[PlayingCard] = new JArrayList[PlayingCard]()
  private var screentip: Screentip = null
  private var score: Score = null
  private var instruction: Score = null
  private var p_score: Score = null
  private var d_score: Score = null
  private var dealer_pile: PlayingCard = null
  private var cards: Cards = null
  private var player: Player = null
  private var dealer: Dealer = null
  private var soundEffects: SoundEffects = null
  def btnHit: JButton = new JButton("Hit")
  def btnStand: JButton = new JButton("Stand")

  final def SCREEN_WIDTH: Int = 780
  final def SCREEN_HEIGHT: Int = 500
  private final def CARD_LIMIT: Int = 42
  private final def DEBUG: Boolean = true

  setBackground(new Color(0, 153, 0))
  screentip = new Screentip(DEBUG, (SCREEN_WIDTH / 2) - 50, 190)
  instruction = new Score(DEBUG, (SCREEN_WIDTH / 2) - 155, 450)
  p_score = new Score(DEBUG, 153, 315)
  d_score = new Score(DEBUG, 153, 25)
  cards = new Cards()
  soundEffects = new SoundEffects()
  dealer_pile = new PlayingCard(cards.getImage("c"), 10, 10)
  Debugger.emit(DEBUG, "Initialized Blackjack (Scala Swing/AWT).")

  def newGame(): Unit = {
    btnHit.setText("Hit")
    btnStand.setVisible(true)
    player_index = 2
    player_cards = new JArrayList[PlayingCard]()
    dealer_index = 2
    dealer_cards = new JArrayList[PlayingCard]()

    player = new Player(DEBUG)
    dealer = new Dealer(DEBUG, cards, soundEffects)

    if(cards.getPlayed == 0 || cards.getPlayed >= CARD_LIMIT) {
      dealer.shuffle()
    }

    screentip.clear
    val pc: Array[PlayingCard] = player.receiveCards(cards, dealer.deal(cards))
    val dc: Array[PlayingCard] = dealer.receiveCards(cards)
    player_cards.add(pc(0))
    player_cards.add(pc(1))
    dealer_cards.add(dc(0))
    dealer_cards.add(dc(1))
    player_cards.add(new PlayingCard(cards.getImage("d"), 405, 310))
    player_cards.add(new PlayingCard(cards.getImage("d"), 495, 310))
    player_cards.add(new PlayingCard(cards.getImage("d"), 585, 310))
    dealer_cards.add(new PlayingCard(cards.getImage("d"), 405, 10))
    dealer_cards.add(new PlayingCard(cards.getImage("d"), 495, 10))
    dealer_cards.add(new PlayingCard(cards.getImage("d"), 585, 10))
    update()
  }

  /**
   * Show cards at end of game.
   */
  private def showCards(): Unit = {
    btnHit.setText("Play")
    btnStand.setVisible(false)
    playing = false
    dealer_cards.set(0, dealer.revealFirstCard(cards))
    val ds: Int = dealer.showCards
    val ps: Int = player.showCards

    if(ps == 21 && ds != 21)
    {
      screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!")
    }
    else if(ds == 21 && ps != 21)
    {
      screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!")
    }
    else if((ps == ds) || (ps > 21 && ds > 21))
    {
      screentip.emit("PUSH", "Neither dealer nor player won.")
    }
    else if(ps <= 21 && ps > ds)
    {
      screentip.emit("PLAYER WINS", s"Player wins with $ds. Well done.")
    }
    else if(ds <= 21 && ds > ps)
    {
      screentip.emit("DEALER WINS", s"Dealer wins with $ds. Too bad.")
    }
    else if(ps > 21 && ds <= 21)
    {
      screentip.emit("DEALER WINS", "Dealer wins. Player bust.")
    }
    else if(ds > 21 && ps <= 21)
    {
      screentip.emit("PLAYER WINS", "Player wins. Dealer bust.")
    }

    d_score.emit(dealer.calcTotal)
    Debugger.emit(DEBUG, s"Cards played $cards.getPlayed")

    if(cards.getPlayed >= CARD_LIMIT)
    {
      instruction.emit("Dealer is shuffling cards...")
    }
    else
    {
      instruction.emit("Play again?")
    }

    if(cards.getPlayed == 52)
    {
      dealer_pile = new PlayingCard(cards.getImage("d"), 10, 10)
    }
  }

  /**
   * Update logic.
   */
  private def update(): Unit = {

    // Determine if a Blackjack or bust has occurred?
    if(hasBlackjack || isBust) {
      showCards()
    }
    p_score.emit(player.calcTotal)

    if(playing) {
      d_score.emit("?")
      instruction.emit("Hit or Stand?")
    }
    repaint()
  }

  /**
   * Determine if a Blackjack has occurred.
   * @return Has a Blackjack occurred?
   */
  private def hasBlackjack: Boolean = {
    var blackjack: Boolean = false
    if(player.hasBlackjack || dealer.hasBlackjack) {
      blackjack = true
    }
    blackjack
  }

  /**
   * Determine if a bust has occurred.
   * @return Has a bust occurred?
   */
  private def isBust: Boolean = {
    var bust: Boolean = false
    if(player.isBust || dealer.isBust) {
      bust = true
    }
    bust
  }

  /**
   * Take a hit.
   */
  private def hit(): Unit = {
    if(player_index < 6) {
      soundEffects.play("hit")
      player_cards.set(player_index, player.hit(cards))
      val xy: Array[Int] = player_cards.get(player_index).getXY
      Debugger.emit(DEBUG, s"Placed card at $xy(0),$xy(1)")
      player_index += 1
      repaint()
    }
  }

  /**
   * Take a stand.
   */
  private def stand(): Unit = {
    player.stand()
    val received: JList[PlayingCard] = dealer.respond(cards)
    var i: Int = 0
    for(i <- 0 to received.size()) {
      val xy: Array[Int] = dealer_cards.get(dealer_index).getXY
      dealer_cards.set(dealer_index, received.get(i))
      dealer_cards.get(dealer_index).setXY(xy(0), xy(1))
      Debugger.emit(DEBUG, s"Placed card at $xy(0),$xy(1)")
      dealer_index += 1
    }
    showCards()
    repaint()
  }

  /**
   * Event handler for hit or stand buttons.
   * @param e ActionEvent
   */
  def actionPerformed(e: ActionEvent): Unit = {
    val src: Object = e.getSource
    if(src == btnHit) {
      if(playing) hit()
      else newGame()
    }
    else if(src == btnStand) {
      if(playing) stand()
    }
    update()
  }

  /**
   * Draw elements to game window.
   * @param g Graphics object.
   */
  override def paint(g: Graphics): Unit = {
    val width: Int = getWidth
    val height: Int = getWidth
    super.paint(g)
    dealer_pile.draw(g)
    screentip.draw(g)
    instruction.draw(g)
    p_score.draw(g)
    d_score.draw(g)
    var i: Int = 0
    for(i <- 0 to dealer_cards.size() - 1) {
      dealer_cards.get(i).draw(g)
      player_cards.get(i).draw(g)
    }
  }
}

object Game {

  /**
   * Entry method for game.
   * @param args Command line arguments.
   */
  def main(args: Array[String]): Unit = {

    val blackjack = new Blackjack()
    val app = new JFrame()

    app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)
    app.add(blackjack)
    app.setSize(blackjack.SCREEN_WIDTH, blackjack.SCREEN_HEIGHT)
    app.setTitle("Blackjack")
    app.setVisible(true)
    app.setResizable(false)

    blackjack.newGame()
  }
}
