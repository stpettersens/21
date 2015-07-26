using UnityEngine;
using System;
using System.Collections;

/// <summary>
/// Debugger helper class.
/// </summary>
public static class Debugger {

    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug">Enable debug?</param>
    /// <param name="message">String to emit</param>
    public static void Emit(bool debug, string message) {
        if (debug) Debug.Log(message);
    }

    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug">Enable debug?</param>
    /// <param name="integer">Integer to emit.</param>
    public static void Emit(bool debug, int integer) {
        Debugger.Emit(debug, integer.ToString());
    }

    /// <summary>
    /// Emit a Debug message.
    /// </summary>
    /// <param name="debug"></param>
    /// <param name="strings">string[] to emit.</param>
    public static void Emit(bool debug, string[] strings) {
        string msg = "";
        for (int i = 0; i < strings.Length; i++)
        {
            msg += String.Format("{0} ", strings[i]);
        }
        Debugger.Emit(debug, msg);
    }
}
