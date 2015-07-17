class Debug {
	static emit(debug: boolean, message: any): void {
		if(debug) console.log(message);
	}
}
