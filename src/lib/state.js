export function generateState(length) {
	var stateString = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		stateString += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return stateString;
}
