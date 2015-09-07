/**
 * Blackjack
 * Copyright 2015 Sam Saint-Pettersen
 * Released under the MIT/X11 License.
 * 
 * Java Swing/AWT implementation.
*/

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.io.IOException;
import org.newdawn.easyogg.OggClip;

public class SoundEffects
{
    private List<String> strEffects;
    private List<OggClip> effects;
    private boolean soundOn;
    
    /**
     * SoundEffects implements playing game sound effects.
    */
    public SoundEffects()
    {
        String s = "sounds/";
        String[] names = { "deal", "shuffle", "hit", "reveal" };
        strEffects = Arrays.asList(names);
        try
        {
            effects = new ArrayList<OggClip>();
            for(int i = 0; i < strEffects.size(); i++)
            {
                effects.add(new OggClip(String.format("%s/%s.ogg", s, strEffects.get(i))));
            }
            soundOn = true;
        }
        catch(IOException e)
        {
            e.printStackTrace();
        }
    }
    
    /**
     * Toggle sound effects on/off.
     * @return Are sound effects on?
    */
    public boolean toggle()
    {
        if(soundOn) soundOn = false;
        else soundOn = true;
        return soundOn;
    }
    
    /**
     * Play a sound effect.
     * @param effect Name of sound effect to play.
    */
    public void play(String effect)
    {
        if(soundOn)
        {
            effects.get(strEffects.indexOf(effect)).play();
        }
    }
}
