function isTouchScreenDevice() {
	var isTouch = false;
	var ua = navigator.userAgent;
	if(ua.indexOf("Mobile") !== -1 || ua.indexOf("Tablet") !== -1) {
		isTouch = true;
	}
	return isTouch;
}

window.onload = function() {

	if(!isTouchScreenDevice()) alert('Not a touch screen device!');	

	// Touch controls.
	var start;
	document.addEventListener('touchstart', function(event) {
		event.preventDefault();
		start = new Date().getTime();
	});

	document.addEventListener('touchend', function(event) {
		event.preventDefault();
		var elapsed = new Date().getTime() - start;
		if((elapsed < 600) && (elapsed > 0)) {
			alert('Short tap');
		}
		else {
			alert('Long tap');
		}
	});
};
