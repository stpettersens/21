/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;
using System.Collections.Generic;
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
    /// This is the main type for your game
    /// </summary>
    public class Blackjack : Microsoft.Xna.Framework.Game
    {
        bool debug;
        bool ai;
        bool playing;
        int player_index;
        Card[] player_cards;
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
        int timer;

        const int SCREEN_WIDTH = 780;
        const int SCREEN_HEIGHT = 500;

        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        List<string> strCards;
        List<Texture2D> gfxCards;
 
        public Blackjack()
        {
            this.debug = true;
            this.ai = false;
            this.playing = false;

            this.strCards = new List<string>();

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
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            Debugger.Emit(this.debug, "Initialized Blackjack (C#/XNA).");
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

            gfxCards = new List<Texture2D>();
            gfxCards.Add(this.Content.Load<Texture2D>("c"));
            gfxCards.Add(this.Content.Load<Texture2D>("d"));
            for (int i = 0; i < this.strCards.Count; i++)
            {
                gfxCards.Add(this.Content.Load<Texture2D>(strCards[i]));
            }
            this.screentip = new Screentip(this.debug, ((SCREEN_WIDTH / 2) - 50), 190);
            this.instruction = new Score(this.debug, ((SCREEN_WIDTH / 2) - 155), 450);
            this.p_score = new Score(debug, 153, 315);
            this.d_score = new Score(debug, 153, 25);
            this.cards = new Cards(this.strCards, this.gfxCards);
            //this.NewGame();
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
            // Allows the game to exit
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed)
                this.Exit();

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

            spriteBatch.End();
            base.Draw(gameTime);
        }

        private void NewGame()
        {
            this.playing = true;
            this.player_index = 2;
            this.dealer_index = 2;
            this.dealer_pile = new Card(this.cards.GetCardImages(Card.GetImage("c")), 10, 10);
            this.screentip.Clear();
            this.player = new Player(this.debug);
            this.dealer = new Dealer(this.debug);
            this.dealer.Shuffle(this.cards);
            this.player_cards = player.ReceiveCards(cards, this.dealer.Deal(this.cards));
        }
    }
}
