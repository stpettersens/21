using System;
using System.Diagnostics;

namespace Helper 
{
  /// <summary>
  /// Debugger helper class.
  /// </summary>
  class Debugger 
  {
    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug">Enable debug?</param>
    /// <param name="message">String to emit.</param>
    public static void Emit(bool debug, string message) {
        if(debug) Debug.WriteLine(message);
    }

    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug">Enable debug?</param>
    /// <param name="integer">Integer to emit.</param>
    public static void Emit(bool debug, int integer)
    {
        Debugger.Emit(debug, integer.ToString());
    }

    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug">Enable debug?</param>
    /// <param name="strings">string[] to emit.</param>
    public static void Emit(bool debug, string[] strings)
    {
        string msg = "";
        for(int i = 0; i < strings.Length; i++) 
        {
            msg += String.Format("{0} ", strings[i]);
        }
        Debugger.Emit(debug, msg);
    }

    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug">Enable debug?</param>
    /// <param name="cards">Card[] to emit.</param>
    public static void Emit(bool debug, BlackjackXNA.Card[] cards)
    {
        string msg = "";
        for(int i = 0; i < cards.Length; i++)
        {
            msg += String.Format("{0} ", cards[i].ToString());
        }
        Debugger.Emit(debug, msg);
    }
  }
}
