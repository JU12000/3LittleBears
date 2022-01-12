export function generateState(length) {
	let stateString = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		stateString += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return stateString;
}
