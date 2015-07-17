class Debug 
	@emit: (debug, message) ->
		if debug
			console.log(message)
