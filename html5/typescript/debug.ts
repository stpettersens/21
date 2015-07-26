/**
 * @file Debug class.
*/
class Debug {

	/**
	 * Emit a debug message.
	 * @public
	 * @static
	 * @param {boolean} debug - Emit debug message?
	 * @param {any} message - Message to emit.
	*/
	public static emit(debug: boolean, message: any): void {
		if(debug) console.log(message);
	}
}
