function Debug() {};

/**
 * Emit a debug message.
 * @param {Boolean} debug Emit debug message?
 * @param {Any} message Message to emit.
*/
Debug.emit = function(debug, message) {
	if(debug) console.log(message);
};
