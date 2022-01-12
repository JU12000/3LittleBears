import { accessToken, refreshToken, state, verifier } from '@/stores/auth';
import getPkce from 'oauth-pkce';
import toast from '@/stores/toast';

const base = 'https://accounts.spotify.com';

function generateState(length) {
	let stateString = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		stateString += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return stateString;
}

async function getAuthorization() {
	const pkce = await new Promise((resolve) => {
		getPkce(50, (error, { verifier, challenge }) => {
			if (error) {
				toast.push('Something went wrong, try refreshing the page.');
			}

			resolve({ verifier, challenge });
		});
	});

	verifier.set(pkce.verifier);

	const authURL = new URL(
		`${base}/authorize?` +
		new URLSearchParams({
			client_id: import.meta.env.VITE_CLIENT_ID,
			response_type: 'code',
			redirect_uri: import.meta.env.VITE_REDIRECT_URL,
			state: generateState(20),
			scope: import.meta.env.VITE_APPLICATION_SCOPES,
			code_challenge_method: 'S256',
			code_challenge: pkce.challenge
		})
	);

	state.set(authURL.searchParams.get('state'));

	return authURL;
}

export default {
	getAuthorization
}
