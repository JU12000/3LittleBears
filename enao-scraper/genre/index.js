require('dotenv').config();

const { Firestore } = require('@google-cloud/firestore');
const Apify = require('apify');
const fs = require('fs');

const firestore = new Firestore();

// Clear the local storage each time this runs so we don't pollute our data.
if (process.env.NODE_ENV === 'development') {
	fs.rmSync(process.env.APIFY_LOCAL_STORAGE_DIR, {
		recursive: true,
		force: true
	});
}

exports.scrape = async function scrape() {
	console.time('genre function time');

	// The request list and purpose of each request is as follows:
	// 1. All genres by popularity - used to establish and verify the working list
	//		of genres, sorting by popularity means we don't have to do an additional
	//		call to another request to populate that data table.
	// 2. Deepest Only genres by name - collates a list of the genres with a depth
	//		of 2.
	// 3. Deep Only genres by name - collates a list of the genres with a depth of
	//		either 1 or 2. We then filter the results of this request with the results
	//		of the previous request to retrieve all genres with a depth of 1.
	const requestList = await Apify.openRequestList(null, [
		{
			uniqueKey: 'allGenres',
			url: 'https://everynoise.com/everynoise1d.cgi?vector=popularity&scope=all'
		},
		{
			uniqueKey: 'deepestOnlyGenres',
			url: 'https://everynoise.com/everynoise1d.cgi?vector=name&scope=deepest%20only'
		},
		{
			uniqueKey: 'deepOnlyGenres',
			url: 'https://everynoise.com/everynoise1d.cgi?vector=name&scope=deep%20only'
		}
	]);

	const handlePageFunction = async ({ request, $ }) => {
		await Apify.pushData({
			id: request.uniqueKey,
			genres: $('td.note a')
				.map((i, el) => {
					if (request.uniqueKey === 'allGenres') {
						return {
							depth: 0,
							name: $(el).text(),
							popularity: i + 1
						};
					} else {
						return $(el).text();
					}
				})
				.get()
		});
	};

	const crawler = new Apify.CheerioCrawler({
		requestList,
		handlePageFunction
	});

	// Crawl for the data
	await crawler.run();

	const datasetContentItems = await Apify.openDataset()
		.then((dataset) => {
			return dataset.getData();
		})
		.then((datasetContent) => {
			return datasetContent.items;
		});

	const deepestGenres = datasetContentItems
		.filter((x) => x.id === 'deepestOnlyGenres')
		.map((x) => x.genres)[0];

	// Filter the deepOnlyGenres dataset to remove the deepestOnlyGenres
	const deepGenres = datasetContentItems
		.filter((x) => x.id === 'deepOnlyGenres')
		.map((x) => x.genres)[0]
		.filter((x) => !deepestGenres.includes(x));

	const genres = datasetContentItems
		.filter((x) => x.id === 'allGenres')
		.map((x) => x.genres)[0];

	// Update the depths for each genre
	genres.forEach((x) => {
		if (deepestGenres.includes(x.name)) {
			x.depth = 2;
		} else if (deepGenres.includes(x.name)) {
			x.depth = 1;
		}
	});

	await firestore
		.doc('genre/index')
		.set({
			count: genres.length,
			genres: genres,
			lastUpdated: new Date().toUTCString()
		})
		.then((writeResult) => {
			console.log(`Document written at ${writeResult.writeTime.toDate()}`);
		});

	await firestore.terminate().then(() => {
		console.log('Connection to Firestore terminated. Scraping complete');
	});

	console.timeEnd('genre function time');
	console.log(
		'genre function memory used: ' +
			Math.round(process.memoryUsage().heapUsed / 1048576) +
			'MB'
	);

	return 1;
};
