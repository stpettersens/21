function Debug() {};

/**
 * Emit a debug message.
 * @param {boolean} debug - Emit debug message?
 * @param {any} message - Message to emit.
*/
Debug.emit = function(debug, message) {
	if(debug) console.log(message);
};
