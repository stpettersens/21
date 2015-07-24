/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;
using System.Collections.Generic;
using System.Threading;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.GamerServices;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;
using Helper;

namespace BlackjackXNA
{
    /// <summary>
    /// Blackjack implements the overall game.
    /// </summary>
    public class Blackjack : Microsoft.Xna.Framework.Game
    {
        bool ai;
        bool playing;
        int player_index;
        List<Card> player_cards;
        int dealer_index;
        List<Card> dealer_cards;
        Screentip screentip;
        SpriteFont screentipFont;
        Score instruction;
        Score p_score;
        Score d_score;
        SpriteFont scoreFont;
        Card dealer_pile;
        Cards cards;
        Player player;
        Dealer dealer;
        KeyboardState oldKbState;

        const int SCREEN_WIDTH = 780;
        const int SCREEN_HEIGHT = 500;
        const int CARD_LIMIT = 30;
        const bool DEBUG = false;

        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        List<string> strCards;
        List<Texture2D> gfxCards;
 
        public Blackjack()
        {
            ai = false;
            playing = false;

            strCards = new List<string>();
            strCards.Add("c");
            strCards.Add("d");

            for (int i = 1; i <= 13; i++)
            {
                if (i == 1)
                {
                    strCards.Add("hA");
                    strCards.Add("cA");
                    strCards.Add("dA");
                    strCards.Add("sA");
                }
                else if (i == 11)
                {
                    strCards.Add("hJ");
                    strCards.Add("cJ");
                    strCards.Add("dJ");
                    strCards.Add("sJ");
                }
                else if (i == 12)
                {
                    strCards.Add("hQ");
                    strCards.Add("cQ");
                    strCards.Add("dQ");
                    strCards.Add("sQ");
                }
                else if (i == 13)
                {
                    strCards.Add("hK");
                    strCards.Add("cK");
                    strCards.Add("dK");
                    strCards.Add("sK");
                }
                else
                {
                    strCards.Add("h" + i.ToString());
                    strCards.Add("c" + i.ToString());
                    strCards.Add("d" + i.ToString());
                    strCards.Add("s" + i.ToString());
                }
            }
            graphics = new GraphicsDeviceManager(this);
            graphics.IsFullScreen = false;
            graphics.PreferredBackBufferHeight = SCREEN_HEIGHT;
            graphics.PreferredBackBufferWidth = SCREEN_WIDTH;
            Content.RootDirectory = "Content";
            Debugger.Emit(DEBUG, strCards.Count - 2);
            Debugger.Emit(DEBUG, strCards.ToArray());
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            Debugger.Emit(DEBUG, "Initialized Blackjack (C#/XNA).");
            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);
            screentipFont = Content.Load<SpriteFont>("screentipFont");
            scoreFont = Content.Load<SpriteFont>("scoreFont");

            gfxCards = new List<Texture2D>();
            for (int i = 0; i < this.strCards.Count; i++)
            {
                gfxCards.Add(this.Content.Load<Texture2D>(strCards[i]));
            }
            screentip = new Screentip(DEBUG, ((SCREEN_WIDTH / 2) - 50), 190, screentipFont);
            instruction = new Score(DEBUG, ((SCREEN_WIDTH / 2) - 155), 450, scoreFont);
            p_score = new Score(DEBUG, 153, 315, scoreFont);
            d_score = new Score(DEBUG, 153, 25, scoreFont);
            cards = new Cards(strCards, gfxCards);
            NewGame();
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// all content.
        /// </summary>
        protected override void UnloadContent() {}

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {
            // Determine if a Blackjack or bust has occurred?
            if(HasBlackjack() || IsBust())
            {
                ShowCards();
            }
            p_score.Emit(this.player.CalcTotal());

            if(playing)
            {
                d_score.Emit("?");
                instruction.Emit("Hit [H key or X button] or Stand [S key or A button]?");
            }
            
            UpdateInput();
            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Green);
            spriteBatch.Begin();
            dealer_pile.Draw(spriteBatch);
            screentip.Draw(spriteBatch);
            instruction.Draw(spriteBatch);
            p_score.Draw(spriteBatch);
            d_score.Draw(spriteBatch);
            for(int i = 0; i < player_cards.Count; i++)
            {
                player_cards[i].Draw(spriteBatch);
            }
            for (int i = 0; i < dealer_cards.Count; i++)
            {
                dealer_cards[i].Draw(spriteBatch);
            }
            spriteBatch.End();

            base.Draw(gameTime);
        }


        /// <summary>
        /// Update user input.
        /// </summary>
        private void UpdateInput()
        {
            KeyboardState kbState = Keyboard.GetState();
            GamePadState gpState = GamePad.GetState(PlayerIndex.One);

            if (gpState.Buttons.Back == ButtonState.Pressed 
            || kbState.IsKeyDown(Keys.Escape))
            {
                this.Exit();
            }          
            else if (gpState.Buttons.BigButton == ButtonState.Pressed 
            || kbState.IsKeyDown(Keys.F1))
            {
                ViewGitHubRepo();
            }

            if(playing)
            {
                if (gpState.Buttons.X == ButtonState.Pressed || kbState.IsKeyDown(Keys.H))
                {
                    if (!oldKbState.IsKeyDown(Keys.H))
                        Hit();
                }
                else if (gpState.Buttons.A == ButtonState.Pressed|| kbState.IsKeyDown(Keys.S))
                {
                    if (!oldKbState.IsKeyDown(Keys.S))
                        Stand();
                }
            }
            else
            {
                if (gpState.Buttons.Y == ButtonState.Pressed || kbState.IsKeyDown(Keys.Y))
                {
                    if(!oldKbState.IsKeyDown(Keys.Y))
                        NewGame();
                }
                else if (kbState.IsKeyDown(Keys.N))
                {
                    if (!oldKbState.IsKeyDown(Keys.N))
                        this.Exit();
                }
            }

            oldKbState = kbState;
        }

        /// <summary>
        /// Determine if a Blackjack has occurred.
        /// </summary>
        /// <returns>Has a Blackjack occurred?</returns>
        private bool HasBlackjack()
        {
            bool blackjack = false;
            if(player.HasBlackjack() || dealer.HasBlackjack())
            {
                blackjack = true;
            }
            return blackjack;
        }

        /// <summary>
        /// Determine if a bust has occurred.
        /// </summary>
        /// <returns>Has a bust occurred?</returns>
        private bool IsBust()
        {
            bool bust = false;
            if(player.IsBust() || dealer.IsBust())
            {
                bust = true;
            }
            return bust;
        }

        /// <summary>
        /// Take a hit.
        /// </summary>
        private void Hit()
        {
            if(player_index < 6)
            {
                player_cards[player_index] = player.Hit(cards);
                int[] xy = player_cards[player_index].GetXandY();
                Debugger.Emit(DEBUG, String.Format("Placed card at {0},{1}", xy[0], xy[1]));
                player_index++; 
            }
        }

        /// <summary>
        /// Take a stand.
        /// </summary>
        private void Stand()
        {
            this.player.Stand();
            List<Card> received = dealer.Respond(cards);
            for(int i = 0; i < received.Count; i++)
            {
                Vector2 xy = dealer_cards[dealer_index].GetXY();
                int[] x_y = dealer_cards[dealer_index].GetXandY();
                dealer_cards[dealer_index] = received[i];
                dealer_cards[dealer_index].SetXY(xy);
                Debugger.Emit(DEBUG, String.Format("Added image at {0},{1}", x_y[0], x_y[1]));
                Debugger.Emit(DEBUG, dealer_index);
            }

            ShowCards();
        }

        /// <summary>
        /// Bring up project's repository on GitHub.
        /// </summary>
        private void ViewGitHubRepo()
        {
            System.Diagnostics.Process.Start("https://github.com/stpettersens/21");
        }

        /// <summary>
        /// Show cards at end of game.
        /// </summary>
        private void ShowCards()
        {
            playing = false;
            dealer_cards[0] = dealer.RevealFirstCard(cards);
            int ds = dealer.ShowCards();
            int ps = player.ShowCards();

            if(ps == 21 && player_index == 2 && ds != 21)
            {
                screentip.Emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");
            }
            else if(ds == 21 && dealer_index == 2 && ps != 21)
            {
                screentip.Emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blackjack!");
            }
            else if((ps == ds) || (ps > 21 && ds > 21))
            {
                screentip.Emit("PUSH", "Neither dealer nor player won.");
            }
            else if(ps <= 21 && ps > ds)
            {
                screentip.Emit("PLAYER WINS", String.Format("Player wins with {0}. Well done.", ps));
            }
            else if(ds <= 21 && ds > ps)
            {
                screentip.Emit("DEALER WINS", String.Format("Dealer wins with {0}. Too bad.", ds));
            }
            else if(ps > 21 && ds <= 21)
            {
                screentip.Emit("DEALER WINS", "Dealer wins. Player bust.");
            }
            else if(ds > 21 && ps <= 21)
            {
                screentip.Emit("PLAYER WINS", "Player wins. Dealer bust.");
            }

            d_score.Emit(dealer.CalcTotal());
            Debugger.Emit(DEBUG, String.Format("Cards played {0}", cards.GetPlayed()));

            if (cards.GetPlayed() >= CARD_LIMIT)
                instruction.Emit("Dealer is shuffling cards... [Press Y key or Y button]");
            else
                instruction.Emit("Play again? Yes [Y key or Y button] or N [N key or Back button]");

            if(cards.GetPlayed() == 52)
                dealer_pile = new Card(cards.GetImage("d"), 10, 10);
        }

        /// <summary>
        /// Start a new game.
        /// </summary>
        private void NewGame()
        {
            playing = false;
            player_index = 2;
            player_cards = new List<Card>();
            dealer_index = 2;
            dealer_cards = new List<Card>();

            player = new Player(DEBUG);
            dealer = new Dealer(DEBUG, cards);
            dealer_pile = new Card(cards.GetImage("c"), 10, 10);

            if (cards.GetPlayed() == 0 || cards.GetPlayed() >= CARD_LIMIT)
            {
                Thread shuffleThread = new Thread(dealer.Shuffle);
                shuffleThread.Name = "shuffleThread";
                shuffleThread.IsBackground = true;
                shuffleThread.Start();
                while (shuffleThread.IsAlive) 
                {
                    Debugger.Emit(DEBUG, "Shuffling...");
                }
                playing = true;
            }
            else
                playing = true;

            if(playing)
            {
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
}
