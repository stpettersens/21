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

class Screentip
{
	var debug: Bool;
	var posX: Int;
	var posY: Int;
	var title: String;
	var msg: String;

	public function new(debug: Bool, posX: Float, posY: Float)
	{
		this.debug = debug;
		this.posX = Math.floor(posX);
		this.posY = Math.floor(posY);
		this.title = "";
		this.msg = "";
		Debug.emit(this.debug, "Created screentip at $posX, $posY"); // !
	}

	public function emit(title: String, message: String): Void
	{
		this.clear();
		this.title = title;
		this.msg = message;
	}

	public function clear(): Void
	{
		this.title = "";
		this.msg = "";
	}

	public function draw(): Void
	{
		// TODO
	}
}
