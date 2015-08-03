/*
	Blackjack
	Copyright 2015 Sam Saint-Pettersen
	Released under the MIT/X11 License.
	
	HTML5/enchant.js implementation
*/

/**
 * @file Blackjack implementation in JavaScript.
 * @copyright 2015 Sam Saint-Pettersen
*/

window.onload = function() {
	enchant();
	var game = new Core(780, 700);
	var g = 'graphics/';
	game.preload(g + 'c.png', g + 'sA.png');
	game.onload = function() {
		var scene = new Scene();
		var sprite = new Sprite(71, 96);
		sprite.image = game.assets[g + 'sA.png'];
		scene.addChild(sprite);
		game.pushScene(scene);
	};
	game.start();
};
