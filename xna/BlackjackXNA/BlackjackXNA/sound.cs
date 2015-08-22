using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework.Audio;

namespace Helper
{
    class SoundEffects
    {
        private bool soundOn;
        private List<string> streffects;
        private List<SoundEffect> effects;

        /// <summary>
        /// Sound effect implements playing game sound effects.
        /// </summary>
        /// <param name="streffects">List of sound effect names</param>
        /// <param name="effects">List of sound effect objects</param>
        public SoundEffects(List<string> streffects, List<SoundEffect> effects)
        {
            soundOn = true;
            this.streffects = streffects;
            this.effects = effects;
        }

        /// <summary>
        /// Toggle sound effects on/off.
        /// </summary>
        /// <returns>Are sound effects on?</returns>
        public bool Toggle()
        {
            if (soundOn) soundOn = false;
            else soundOn = true;
            return soundOn;
        }

        /// <summary>
        /// Play a sound effect.
        /// </summary>
        /// <param name="effect">Name of sound effect to play</param>
        public void Play(string effect)
        {
            if(soundOn)
                this.effects[this.streffects.IndexOf(effect)].Play();
        }
    }
}
