/*
  Blackjack
  Copyright 2015 Sam Saint-Pettersen
  Released under the MIT/X11 License.

  C#/XNA implementation
*/
using UnityEngine;
using System;
using System.Collections;

/// <summary>
/// Screentip implements a title and message box.
/// </summary>
public class Screentip {
    private bool debug;
    private int posX;
    private int posY;
    private string title;
    private string msg;

    /// <summary>
    /// Constructor for screentip.
    /// </summary>
    /// <param name="debug">Enable debug messages?</param>
    /// <param name="posX">X position for screentip.</param>
    /// <param name="posY">Y position for screentip.</param>
    public Screentip(bool debug, int posX, int posY) {
        this.debug = debug;
        this.posX = posX;
        this.posY = posY;
        Debugger.Emit(this.debug, String.Format("Created screentip at {0},{1}", posX, posY));
    }

    /// <summary>
    /// Emit a title and message.
    /// </summary>
    /// <param name="title">Title to emit.</param>
    /// <param name="message">Message to emit.</param>
    public void Emit(string title, string message) {
        this.Clear();
        this.title = title;
        this.msg = message;
    }

    /// <summary>
    /// Clear the screentip.
    /// </summary>
    public void Clear() {
        this.title = "";
        this.msg = "";
    }

    /// <summary>
    /// Draw the screentip.
    /// </summary>
    public void Draw() {
        Rect rect1 = new Rect(this.posX, this.posY, 300, 20);
        Rect rect2 = new Rect(this.posX - 45, this.posY + 20, 300, 20);
        GUI.Label(rect1, this.title);
        GUI.Label(rect2, this.msg);
    }
}
