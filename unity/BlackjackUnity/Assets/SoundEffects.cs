using UnityEngine;
using System.Collections.Generic;

public class SoundEffects {
    private bool soundOn;
    private AudioSource source;
    private List<string> strSfx;
    private List<AudioClip> sfx;

    /// <summary>
    /// Sound effects implements a mechanism for playing sound effects.
    /// </summary>
    /// <param name="strSfx">List of sound effect names.</param>
    /// <param name="sfx">List of sound effect objects.</param>
    public SoundEffects(List<string> strSfx, List<AudioClip> sfx) {
        soundOn = true;
        this.source = new AudioSource();
        this.strSfx = strSfx;
        this.sfx = sfx;
        Debugger.Emit(true, strSfx.Count);
        Debugger.Emit(true, sfx.Count);
    }

    /// <summary>
    /// Toggle sound effects on/off.
    /// </summary>
    /// <returns>Are sound effects on?</returns>
    public bool Toggle() {
        if (soundOn) soundOn = false;
        else soundOn = true;
        return soundOn;
    }

    /// <summary>
    /// Play a sound effect.
    /// </summary>
    /// <param name="effect">Name of sound effect to play.</param>
    public void Play(string effect) {
        AudioClip audio = sfx[1]; //sfx[strSfx.IndexOf(effect)];
        Debugger.Emit(true, sfx[1].ToString());
        source.clip = audio;
        if(soundOn) source.Play();
    }
}
