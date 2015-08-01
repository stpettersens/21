/*
    Blackjack
    Copyright 2015 Sam Saint-Pettersen
    Released under the MIT/X11 License.
    
    Flambe/Haxe implementation
*/
package blackjack;

import flambe.Entity;
import flambe.System;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.display.FillSprite;
import flambe.display.ImageSprite;

class Score
{
	var debug: Bool;
	var posX: Int;
	var posY: Int;
	var score: String;

	public function new(debug: Bool, posX: Float, posY: Float)
	{
		this.debug = debug;
		this.posX = Math.floor(posX);
		this.posY = Math.floor(posY);
		this.score = "";
		Debug.emit(this.debug, "Created score counter at $posX, $posY"); // !
	}

	public function emit(score: Dynamic): Void
	{
		this.clear();
		this.score = Std.string(score);
	}

	public function clear(): Void
	{
		this.score = "";
	}

	public function draw(): Void
	{
		// TODO
	}
}
