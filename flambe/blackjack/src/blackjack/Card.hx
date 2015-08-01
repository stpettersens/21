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

class Card 
{
	var image: ImageSprite;
	var src: String;
	var posX: Int;
	var posY: Int;

	public function new(card: String, posX: Int, posY: Int, pack: AssetPack) 
	{
		this.image = new ImageSprite(pack.getTexture(this.getImage(card)));
		this.src = card;
		this.posX = posX;
		this.posY = posY;
		this.image.x._ = posX;
		this.image.y._ = posY;
	}

	function getImage(card: String): String 
	{
		return card;
	}

	public function getImageSrc(): String 
	{
		return this.src;
	}

	public function setXY(posX: Int, posY: Int): Void
	{
		this.posX = posX;
		this.posY = posY;
		this.image.x._ = posX;
		this.image.y._ = posY;
	}

	public function getXY(): Array<Int>
	{
		return [ this.posX, this.posY ];
	}

	public function draw(): Void
	{
		System.root.addChild(new Entity().add(this.image));
	}
}
