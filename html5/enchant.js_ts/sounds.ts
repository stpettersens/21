/// <reference path="enchant.d.ts" />

/* Sound effects for generated game. */
var s: string = 'sounds/';

class SoundEffects {
	private static soundOn = true;

	/**
	 * Toggle sound effects on/off.
	 * @returns {boolean} Are sound effects on?
	*/
	public static toggle() {
		if(SoundEffects.soundOn)
			SoundEffects.soundOn = false;
		else
			SoundEffects.soundOn = true;

		return SoundEffects.soundOn;
	}

	/**
	 * Play sound effect.
	 * @param {Core} game - Enchant.js game object.
	 * @param {string} effect - Name of sound effect to play.
	*/
	public static play(game: Core, effect: string) {
		if(SoundEffects.soundOn) {
			if (game.sfx)
				game.assets[s + effect + '.ogg'].play();
			else
				new Audio(s + effect + '.ogg').play();
		}
	}
}
