/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

public class SoundEffects
{
    private boolean soundOn;
    
    public SoundEffects()
    {
        soundOn = true;
    }
    
    public boolean toggle()
    {
        if(soundOn) soundOn = false;
        else soundOn = true;
        return soundOn;
    }
    
    public void play(String effect)
    {
        if(soundOn)
        {
            // TODO
        }
    }
}
