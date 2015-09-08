/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 *
 * Scala Swing/AWT implementation.
 */

package io.stpettersen.blackjack
import java.util.{List => JList, ArrayList => JArrayList}
import javax.swing.{JApplet, JButton, JRootPane}
import java.awt.{Graphics, Color}
import java.awt.event.{ActionEvent, ActionListener}

class BlackjackApplet extends JApplet with ActionListener {

  private var ai: Boolean = false
  private var playing: Boolean = false
  private var player_index: Int = 2
  private var player_cards: JList[PlayingCard] = new JArrayList[PlayingCard]()
  private var dealer_index: Int = 2
  private var dealer_cards: JList[PlayingCard] = new JArrayList[PlayingCard]()
  private var screentip: Screentip = null
  private var score: Score = null
  private var instruction: Score = null
  private var p_score: Score = null
  private var d_score: Score = null
  private var dealer_pile: PlayingCard = null
  private var cards: Cards = null
  private var player: Player = null
  private var dealer: Dealer = null
  private var btnHit: JButton = null
  private var btnStand: JButton = null

  private final def SCREEN_WIDTH: Int = 780
  private final def SCREEN_HEIGHT: Int = 500
  private final def CARD_LIMIT: Int = 42
  private final def DEBUG: Boolean = false

  /**
   * Called by the browser or applet viewer to iinform this JApplet that it
   * has been loaded into the system. It is always called before the first
   * time that the start method is called.
   */
  override def init(): Unit = {

    // This is a workaround for a security conflict with some browsers
    // including some versions of Netscape & Internet Explorer which do
    // not allow access to the AWT system event queue which JApplets
    // do on start up to check access. May not be necessary with your browser.
    val rootPane: JRootPane = this.getRootPane
    rootPane.putClientProperty("defaultSystemEventQueueCheck", java.lang.Boolean.TRUE);

    screentip = new Screentip(DEBUG, (SCREEN_WIDTH / 2) - 50, 190)
    instruction = new Score(DEBUG, (SCREEN_WIDTH / 2) - 155, 450)
    p_score = new Score(DEBUG, 153, 315)
    d_score = new Score(DEBUG, 153, 25)
    cards = new Cards()
    dealer_pile = new PlayingCard(cards.getImage("c"), 10, 10)
    btnHit = new JButton("Hit")
    btnStand = new JButton("Stand")
    btnHit.addActionListener(this)
    btnStand.addActionListener(this)
    this.add(btnHit)
    this.add(btnStand)
    Debugger.emit(DEBUG, "Initialized Blackjack Applet (Scala Swing/AWT).")
  }

  /**
   * Called by the browser or applet viewer to inform this JApplet that is
   * should start its execution. It is called after the init method and
   * each time the JApplet is revisited in a Web page.
   */
  override def start(): Unit = {
    newGame()
  }

  /**
   * Called by the browser or applet viewer to inform this JApplet that
   * it should stop its execution. It is called when the Web page that
   * contains this JApplet as been replaced by another page, and also
   * just before the JApplet is to be destroyed.
   */
  override def stop(): Unit = {}

  /**
   * Start a new game.
   */
  private def newGame(): Unit = {
    playing = true
    player_index = 2
    player_cards = new JArrayList[PlayingCard]()
    dealer_index = 2
    dealer_cards = new JArrayList[PlayingCard]()

    player = new Player(DEBUG)
    dealer = new Dealer(DEBUG, cards)

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
    playing = false
    dealer_cards.set(0, dealer.revealFirstCard(cards))
    val ds: Int = dealer.showCards
    val ps: Int = player.showCards

    if(ps == 21 && ds != 21)
    {
      screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
    }
    else if(ds == 21 && ps != 21)
    {
      screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
    }
    else if((ps == ds) || (ps > 21 && ds > 21))
    {
      screentip.emit("PUSH", "Neither dealer nor player won.");
    }
    else if(ps <= 21 && ps > ds)
    {
      //screentip.emit("PLAYER WINS", String.format("Player wins with %d. Well done.", ps));
    }
    else if(ds <= 21 && ds > ps)
    {
      //screentip.emit("DEALER WINS", String.format("Dealer wins with %d. Too bad.", ds));
    }
    else if(ps > 21 && ds <= 21)
    {
      screentip.emit("DEALER WINS", "Dealer wins. Player bust.");
    }
    else if(ds > 21 && ps <= 21)
    {
      screentip.emit("PLAYER WINS", "Player wins. Dealer bust.");
    }

    d_score.emit(dealer.calcTotal)
    //Debugger.emit(DEBUG, String.format("Cards played %d", cards.getPlayed));

    if(cards.getPlayed >= CARD_LIMIT)
    {
      instruction.emit("Dealer is shuffling cards...");
    }
    else
    {
      instruction.emit("Play again? Press Hit or Stand.");
    }

    if(cards.getPlayed == 52)
    {
      dealer_pile = new PlayingCard(cards.getImage("d"), 10, 10);
    }
    repaint()
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
      player_cards.set(player_index, player.hit(cards))
      val xy: Array[Int] = player_cards.get(player_index).getXY
      //Debugger.emit(DEBUG, String.format("Placed card at %d,%d", xy(0), xy(1)))
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
   * @param e ActionEvent.
   */
  def actionPerformed(e: ActionEvent): Unit = {
    val src: Object = e.getSource
    if(src == btnHit) {
      if(playing) hit()
      else newGame()
    }
    else if(src == btnStand) {
      if(playing) stand()
      else newGame()
    }
    update()
  }

  /**
   * Paint method for applet.
   * @param g Graphics object for this applet.
   */
  override def paint(g: Graphics): Unit = {
    g.setColor(new Color(0, 153, 0))
    g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    dealer_pile.draw(g)
    screentip.draw(g)
    instruction.draw(g)
    p_score.draw(g)
    d_score.draw(g)
    var i: Int = 0
    for(i <- 0 to dealer_cards.size()) {
      dealer_cards.get(i).draw(g)
      player_cards.get(i).draw(g)
    }
    btnHit.setLocation(10, 320)
    btnHit.setSize(100, 25)
    btnStand.setLocation(10, 350)
    btnStand.setSize(100, 25)
  }

  /**
   * Called by the browser or applet viewer to inform this JApplet that is
   * is being reclaimed and that it should destroy any resources that it
   * has allocated. The stop method will always be called before destroy.
   */
  override def destroy(): Unit = {}

  /**
   * Returns information about this applet.
   * An applet should override this method to return a String containing
   * information about the author, version, and copyright of the JApplet.
   *
   * @return A String representation of information about this JApplet.
   */
  override def getAppletInfo: String = {
    "Blackjack\nCopyright 2015 Sam Saint-Pettersen"
  }

  /**
   * Returns parameter information about this JApplet.
   * Returns information about the parameters that are understood by this JApplet.
   * An applet should override this method to return an array of Strings
   * describing these parameters.
   * Each element of the array should be a set of three Strings containing
   * the name, the type, and a description.
   *
   * @return An String[] representation of paramter information about this JApplet.
   */
  override def getParameterInfo: Array[Array[String]] = {
    val paramInfo: Array[Array[String]] = Array(
      Array("ai", "boolean", "false")
    )
    paramInfo
  }
}
