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

var g = 'graphics/';
var graphics = [
	g + 'c.png',
	g + 'd.png'
];

window.onload = function() {
	enchant();
	var game = new Core(1000, 500);
	game.preload(graphics);
	game.onload = function() {
		var scene = new Scene();
		var sprite = new Sprite(71, 96);
		sprite.image = game.assets[graphics[0]];
		scene.addChild(sprite);
		game.pushScene(scene);
	};
	game.start();
};
