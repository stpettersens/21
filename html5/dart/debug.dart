class Debug {

	/// Emit a debug message.
	/// [bool] debug Emit debug message?
	/// [dynamic] message Message to emit.
	static void emit(bool debug, dynamic message) {
		if(debug) print(message);
	}
}
