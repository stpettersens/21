using System.Diagnostics;

class Debugger {
  public static void Emit(bool debug, dynamic message) {
    if(debug) Debug.WriteLine(message);
  }
}
