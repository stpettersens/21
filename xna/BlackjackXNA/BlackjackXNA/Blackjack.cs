/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.GamerServices;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;

namespace BlackjackXNA
{
    /// <summary>
    /// This is the main type for your game
    /// </summary>
    public class Blackjack : Microsoft.Xna.Framework.Game
    {
        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        Texture2D blankCard;
        Texture2D dummyCard;
        List<string> str_hearts;
        List<string> str_clubs;
        List<string> str_diamonds;
        List<string> str_spades;
        List<Texture2D> gfx_hearts;
        List<Texture2D> gfx_clubs;
        List<Texture2D> gfx_diamonds;
        List<Texture2D> gfx_spades;
 
        public Blackjack()
        {
            str_hearts = new List<string>();
            str_clubs = new List<string>();
            str_diamonds = new List<string>();
            str_spades = new List<string>();

            for (int i = 1; i <= 13; i++)
            {
                if (i == 1)
                {
                    str_hearts.Add("hA");
                    str_clubs.Add("cA");
                    str_diamonds.Add("dA");
                    str_spades.Add("sA");
                }
                else if (i == 11)
                {
                    str_hearts.Add("hJ");
                    str_clubs.Add("cJ");
                    str_diamonds.Add("dJ");
                    str_spades.Add("sJ");
                }
                else if (i == 12)
                {
                    str_hearts.Add("hQ");
                    str_clubs.Add("cQ");
                    str_diamonds.Add("dQ");
                    str_spades.Add("sQ");
                }
                else if (i == 13)
                {
                    str_hearts.Add("hK");
                    str_clubs.Add("cK");
                    str_diamonds.Add("dK");
                    str_spades.Add("sK");
                }
                else
                {
                    str_hearts.Add("h" + i.ToString());
                    str_clubs.Add("c" + i.ToString());
                    str_diamonds.Add("d" + i.ToString());
                    str_spades.Add("s" + i.ToString());
                }
            }
            graphics = new GraphicsDeviceManager(this);
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
            // TODO: Add your initialization logic here

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

            // TODO: use this.Content to load your game content here
            blankCard = this.Content.Load<Texture2D>("c");
            dummyCard = this.Content.Load<Texture2D>("d");

            gfx_hearts = new List<Texture2D>();
            gfx_clubs = new List<Texture2D>();
            gfx_diamonds = new List<Texture2D>();
            gfx_spades = new List<Texture2D>();
            for (int i = 0; i < str_hearts.Count; i++)
            {
                gfx_hearts.Add(this.Content.Load<Texture2D>(str_hearts[i]));
                gfx_clubs.Add(this.Content.Load<Texture2D>(str_clubs[i]));
                gfx_diamonds.Add(this.Content.Load<Texture2D>(str_diamonds[i]));
                gfx_spades.Add(this.Content.Load<Texture2D>(str_spades[i]));
            }
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// all content.
        /// </summary>
        protected override void UnloadContent()
        {
            // TODO: Unload any non ContentManager content here
        }

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

            // TODO: Add your update logic here

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
            Card card = new Card(gfx_hearts[0], 10, 10);
            card.Draw(spriteBatch);
            spriteBatch.End();
            base.Draw(gameTime);
        }
    }
}
