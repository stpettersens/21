package blackjack;

class Debug
{
	public static function emit(debug: Bool, message: Dynamic): Void
	{
		if(debug) trace(message);
	}
}
