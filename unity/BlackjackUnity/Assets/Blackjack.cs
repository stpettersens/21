/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/Unity implementation
*/
using UnityEngine;
using System;
using System.Collections.Generic;
using System.Threading;
using System.IO;

/// <summary>
/// Blackjack implements the overall game.
/// </summary>
public class Blackjack : MonoBehaviour {
    bool ai;
    bool playing;
    int player_index;
    List<Card> player_cards;
    int dealer_index;
    List<Card> dealer_cards;
    Screentip screentip;
    Score instruction;
    Score p_score;
    Score d_score;
    Card dealer_pile;
    Cards cards;
    Player player;
    Dealer dealer;
    SoundEffects soundEffects;

    const int SCREEN_WIDTH = 720;  // 800 
    const int SCREEN_HEIGHT = 480; // 600
    const int CARD_LIMIT = 30;
    const bool DEBUG = true;

    List<string> strCards;
    List<Texture2D> gfxCards;
    List<string> strEffects;
    List<AudioClip> effects;

    /// <summary>
    /// Load a graphic for game.
    /// </summary>
    /// <param name="filePath">File path to graphic.</param>
    void LoadGraphic(string filePath) {
        byte[] fileData;
        if (File.Exists(filePath)) {
            fileData = File.ReadAllBytes(filePath);
            Texture2D graphic = new Texture2D(71, 96);
            graphic.LoadImage(fileData);
            gfxCards.Add(graphic);
        }
    }

    /// <summary>
    /// Load a sound effect for game.
    /// </summary>
    /// <param name="filePath">File path to sound effect.</param>
    void LoadSoundEffect(string filePath) {
        if (File.Exists(filePath)) {
            WWW www = new WWW("file://" + filePath);
            AudioClip audio = www.GetAudioClip(false);
            audio.name = Path.GetFileName(filePath);
            Debugger.Emit(DEBUG, String.Format("Loaded sound: {0}", audio.name));
            effects.Add(audio);
        }
    }

    /// <summary>
    /// Initialize the game cards.
    /// </summary>
    void InitCards() {
        strCards.Add("c");
        strCards.Add("d");
        for(int i = 1; i <= 13; i++) {
            if (i == 1) {
                strCards.Add("hA");
                strCards.Add("cA");
                strCards.Add("dA");
                strCards.Add("sA");
            }
            else if (i == 11) {
                strCards.Add("hJ");
                strCards.Add("cJ");
                strCards.Add("dJ");
                strCards.Add("sJ");
            }
            else if (i == 12) {
                strCards.Add("hQ");
                strCards.Add("cQ");
                strCards.Add("dQ");
                strCards.Add("sQ");
            }
            else if (i == 13) {
                strCards.Add("hK");
                strCards.Add("cK");
                strCards.Add("dK");
                strCards.Add("sK");
            }
            else {
                strCards.Add("h" + i.ToString());
                strCards.Add("c" + i.ToString());
                strCards.Add("d" + i.ToString());
                strCards.Add("s" + i.ToString());
            }
        }
        for (int i = 0; i < strCards.Count; i++) {
            LoadGraphic(String.Format("Assets/graphics/{0}.png", strCards[i]));
        }
    }

    void InitSoundEffects() {
        strEffects.Add("dealer");
        strEffects.Add("hit");
        strEffects.Add("reveal");
        strEffects.Add("shuffle");
        strEffects.Add("shuffle");
        for (int i = 0; i < strEffects.Count; i++) {
            Debugger.Emit(DEBUG, "Added sound effect!");
            LoadSoundEffect(String.Format("Assets/sounds/{0}.ogg", strEffects[i]));
        }
    }

	/// <summary>
	/// Initialize game.
	/// </summary>
	void Start() {
        ai = false;
        playing = false;
        strCards = new List<string>();
        gfxCards = new List<Texture2D>();
        strEffects = new List<string>();
        effects = new List<AudioClip>();
        InitCards();
        InitSoundEffects();
        soundEffects = new SoundEffects(strEffects, effects);
        screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 50), 190);
        instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 155), 440);
        p_score = new Score(DEBUG, 153, 315);
        d_score = new Score(DEBUG, 153, 25);
        cards = new Cards(strCards, gfxCards);
        NewGame();

        Debugger.Emit(DEBUG, "Initialized Blackjack (C#/Unity).");
        Debugger.Emit(DEBUG, strCards.Count - 2);
        Debugger.Emit(DEBUG, strCards.ToArray());
	}

    /// <summary>
    /// Draw a graphic.
    /// </summary>
    void OnGUI() {
        dealer_pile.Draw();
        screentip.Draw();
        instruction.Draw();
        p_score.Draw();
        d_score.Draw();
        for (int i = 0; i < player_cards.Count; i++) {
            player_cards[i].Draw();
        }
        for (int i = 0; i < dealer_cards.Count; i++) {
            dealer_cards[i].Draw();
        }
    }
	
    /// <summary>
	/// Update is called once per frame
    /// </summary>
	void Update() {
        // Determine if a Blackjack or bust has occurred?
        if (HasBlackjack() || IsBust()) {
            ShowCards();
        }
        p_score.Emit(player.CalcTotal());

        if (playing) {
            d_score.Emit("?");
            instruction.Emit("Hit [H key or LMB] or Stand [S key or RMB]?");
        }

        UpdateInput();
    }

    /// <summary>
    /// Update user input.
    /// </summary>
    void UpdateInput() {
        if (Input.GetKeyDown(KeyCode.Escape)) {
            Application.Quit();
        }
        else if (Input.GetKeyDown(KeyCode.F1)) {
            ViewGitHubRepo();
        }

        if (playing) {
            if (Input.GetKeyDown(KeyCode.H) || Input.GetMouseButtonDown(0))
                Hit();

            else if (Input.GetKeyDown(KeyCode.S) || Input.GetMouseButtonDown(1))
                Stand();
        }
        else {
            if (Input.GetKeyDown(KeyCode.Y) || Input.GetMouseButtonDown(0))
                NewGame();

            else if (Input.GetKeyDown(KeyCode.N))
                Application.Quit();
        }
    }

    /// <summary>
    /// Determine if a Blackjack has occurred.
    /// </summary>
    /// <returns>Has a Blackjack occurred?</returns>
    bool HasBlackjack() {
        bool blackjack = false;
        if (player.HasBlackjack() || dealer.HasBlackjack()) {
            blackjack = true;
        }
        return blackjack;
    }

    /// <summary>
    /// Determine if a bust has occurred.
    /// </summary>
    /// <returns></returns>
    bool IsBust() {
        bool bust = false;
        if (player.IsBust() || dealer.IsBust()) {
            bust = true;
        }
        return bust;
    }

    /// <summary>
    /// Take a hit.
    /// </summary>
    void Hit() {
        if (player_index < 6) {
            soundEffects.Play("hit");
            player_cards[player_index] = player.Hit(cards);
            int[] xy = player_cards[player_index].GetXY();
            Debugger.Emit(DEBUG, String.Format("Placed card at {0},{1}", xy[0], xy[1]));
            player_index++;
        }
    }

    /// <summary>
    /// Take a stand.
    /// </summary>
    void Stand() {
        player.Stand();
        List<Card> received = dealer.Respond(cards);
        for (int i = 0; i < received.Count; i++) {
            int[] xy = dealer_cards[dealer_index].GetXY();
            dealer_cards[dealer_index] = received[i];
            dealer_cards[dealer_index].SetXY(xy[0], xy[1]);
            Debugger.Emit(DEBUG, dealer_index);
        }

        ShowCards();
    }

    /// <summary>
    /// Bring up project's repository on GitHub.
    /// </summary>
    void ViewGitHubRepo() {
        System.Diagnostics.Process.Start("https://github.com/stpettersens/21");
    }

    /// <summary>
    /// Show cards at end of game.
    /// </summary>
    void ShowCards() {
        playing = false;
        dealer_cards[0] = dealer.RevealFirstCard(cards);
        int ds = dealer.ShowCards();
        int ps = player.ShowCards();

        if (ps == 21 && player_index == 2 && ds != 21) {
            screentip.Emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
        }
        else if (ds == 21 && dealer_index == 2 && ps != 21) {
            screentip.Emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
        }
        else if ((ps == ds) || (ps > 21 && ds > 21)) {
            screentip.Emit("PUSH", "Neither dealer nor player won.");
        }
        else if (ps <= 21 && ps > ds) {
            screentip.Emit("PLAYER WINS", String.Format("Player wins with {0}. Well done.", ps));
        }
        else if (ds <= 21 && ds > ps) {
            screentip.Emit("DEALER WINS", String.Format("Dealer wins with {0}. Too bad.", ds));
        }
        else if (ps > 21 && ds <= 21) {
            screentip.Emit("DEALER WINS", "Dealer wins. Player bust.");
        }
        else if (ds > 21 && ps <= 21) {
            screentip.Emit("PLAYER WINS", "Player wins. Dealer bust.");
        }

        d_score.Emit(dealer.CalcTotal());
        Debugger.Emit(DEBUG, String.Format("Cards played {0}", cards.GetPlayed()));

        if (cards.GetPlayed() >= CARD_LIMIT)
            instruction.Emit("Dealer is shuffling cards... [Press Y key or LMB]");
        else
            instruction.Emit("Play again? Yes [Y key or LMB] or N [N key or Ecape key]");

        if (cards.GetPlayed() == 52)
            dealer_pile = new Card(cards.GetImage("d"), 10, 10);
    }

    /// <summary>
    /// Start a new game.
    /// </summary>
    void NewGame() {
        playing = false;
        player_index = 2;
        player_cards = new List<Card>();
        dealer_index = 2;
        dealer_cards = new List<Card>();

        player = new Player(DEBUG);
        dealer = new Dealer(DEBUG, cards, soundEffects);
        dealer_pile = new Card(cards.GetImage("c"), 10, 10);

        if (cards.GetPlayed() == 0 || cards.GetPlayed() >= CARD_LIMIT) {
            /*Thread shuffleThread = new Thread(dealer.Shuffle);
            shuffleThread.Name = "shuffleThread";
            shuffleThread.IsBackground = true;
            shuffleThread.Start();
            while (shuffleThread.IsAlive) {
                Debugger.Emit(DEBUG, "Shuffling...");
            }*/
            dealer.Shuffle();
            playing = true;
        }
        else
            playing = true;

        if(playing) {
            screentip.Clear();
            player_cards = player.ReceiveCards(cards, dealer.Deal(cards));
            dealer_cards = dealer.ReceiveCards(cards);
            player_cards.Add(new Card(cards.GetImage("d"), 405, 310));
            player_cards.Add(new Card(cards.GetImage("d"), 495, 310));
            player_cards.Add(new Card(cards.GetImage("d"), 585, 310));
            dealer_cards.Add(new Card(cards.GetImage("d"), 405, 10));
            dealer_cards.Add(new Card(cards.GetImage("d"), 495, 10));
            dealer_cards.Add(new Card(cards.GetImage("d"), 585, 10));
        }
    }
}
