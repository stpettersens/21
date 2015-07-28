--- Emit a debug message.
-- @param [boolean] debug Emit debug message?
-- @param [any] message Message to emit.
function Debug_emit(debug, message)
	if debug then
		print(message)
	end
end
