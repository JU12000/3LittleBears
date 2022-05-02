import appengine from 'svelte-adapter-appengine';
import path from 'path';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: appengine(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					'@': path.resolve('./src')
				}
			}
		}
	},

	preprocess: [preprocess({})]
};

export default config;
