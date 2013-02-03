define([ 'dojo/has', 'require' ], function (has, require) {
	var app = {};
	if (has('host-browser')) {
		require('./main');
	}
	else {
		// TODO: Eventually, the Boilerplate will actually have a useful server implementation here :)
		console.log('Hello from the server!');
	}
});