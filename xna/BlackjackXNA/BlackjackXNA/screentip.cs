/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/

class Screentip {
  private bool debug;
  private int posX;
  private int posY;
  private string title;
  private string msg;

  public Screentip(bool debug, int posX, int posY) {
    this.debug = debug;
    this.posX = posX;
    this.posY = posY;
    Debug.Print(this.debug, String.Format("Created screentip at %d,%d", this.posX, this.posY));
  }

  public void Emit(string title, string message) {
    this.Clear();
    this.title = title;
    this.msg = message;
  }

  public void Clear() {
    this.title = "";
    this.msg = "";
  }

  public void Draw() {
    Debug.Print(this.debug, String.Format("Screentip is:\n%s\n%s", this.title, this.msg);
    // TODO Actual XNA draw
  }
}
