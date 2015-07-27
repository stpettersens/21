--- Emit a debug message.
-- @param debug Emit debug message?
-- @param message Message to emit.
function Debug_emit(debug, message)
	if debug then
		print(message)
	end
end
