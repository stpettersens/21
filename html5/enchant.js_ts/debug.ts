class Debug {

	/**
 	 * Emit a debug message.
 	 * @param {boolean} debug - Emit debug message?
 	 * @param {any} message - Message to emit.
	*/
	public static emit(debug: boolean, message: any) {
		if(debug) console.log(message);
	}
}
