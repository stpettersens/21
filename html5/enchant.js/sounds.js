/* Sound effects for generated game. */
var s = 'sounds/';
var sounds = [
s + 'shuffle.ogg',
s + 'deal.ogg',
s + 'reveal.ogg',
s + 'hit.ogg'
];

var soundOn = true;
function SoundEffects() {};

/** 
 * Toggle sound effects on/off.
*/
SoundEffects.toggle = function() {
	if(soundOn) soundOn = false;
	else soundOn = true;
	return soundOn;
}

/**
 * Play sound effect.
 * @param {Object} game - Enchant.js game object.
 * @param {string} effect - Name of sound effect to play. 
*/
SoundEffects.play = function(game, effect) {
	if(soundOn) {
		if(game.sfx) game.assets[s + effect + '.ogg'].play();
		else new Audio(s + effect + '.ogg').play();
	} 
}
