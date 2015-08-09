class Debug 

	# Emit a debug message.
	# @param [Boolean] debug Emit debug message?
	# @param [Any] message Message to emit
	@emit: (debug, message) ->
		if debug
			console.log(message)
