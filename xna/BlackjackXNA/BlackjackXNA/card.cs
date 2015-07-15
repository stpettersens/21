/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/

class Card {
  private string image;
  private int posX;
  private int posY;

  public Card(string card, int posX, int posY) {
    this.image = card;
    this.posX = posX;
    this.posY = posY;
  }

  public static string GetImage(string card) {
    if(card == "c" || card == "d") {
      return String.format("gfx/%s.png", card);
    }
    string suit = "";
  }

  public void SetXY(int posX, int posY) {
    this.posX = posX;
    this.posY = posY;
  }

  public int[] GetXY() {
    return [this.posX, this.posY];
  }

  public void Draw() {
    // TODO
  }
}
