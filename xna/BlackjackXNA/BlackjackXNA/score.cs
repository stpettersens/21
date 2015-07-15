/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/

class Score {
  private bool debug;
  private int posX;
  private int posY;
  private string score;

  public Score(bool debug, int posX, int posY) {
    this.debug = debug;
    this.posX = posX;
    this.posY = posY;
    this.score = "";
    Debug.Print(this.debug, String.Format("Created score counter at %d,%d", this.posX, this.posY));
  }

  public void Emit(dynamic score) {
    this.Clear();
    this.score = score.toString();
  }

  public void Clear() {
    this.score = "";
  }

  public void Draw() {
    Debug.Print(String.Format("Score is '%s'", this.score);
    // TODO Actual XNA draw
  }
}
