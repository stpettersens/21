/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using System;

namespace BlackjackXNA
{
#if WINDOWS || XBOX
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            using (Blackjack game = new Blackjack())
            {
                game.Run();
            }
        }
    }
#endif
}
