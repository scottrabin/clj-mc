require({
	paths: {
		"jQuery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"React": "http://fb.me/react-0.8.0"
	}
}, [
	"React",
	"component/root"
], function(React, RootComponent) {
	"use strict";

	React.renderComponent(
		RootComponent({}),
		document.body
	);
});
