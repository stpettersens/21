using System.Diagnostics;
using System.Dynamic;

namespace Helper 
{
  class Debugger 
  {
    public static void Emit(bool debug, string message) {
        if(debug) Debug.WriteLine(message);
    }

    public static void Emit(bool debug, int message)
    {
        Debugger.Emit(debug, message.ToString());
    }
  }
}
