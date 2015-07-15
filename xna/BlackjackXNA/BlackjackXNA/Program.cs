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

