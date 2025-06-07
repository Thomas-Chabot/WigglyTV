//@ts-nocheck

import { addonBuilder, MetaPreview, serveHTTP } from "stremio-addon-sdk";
import manifest from "../manifest.json"
import { getChannels } from "./content";
import { getCategories, getStreams } from "./content/channels";

// note: TypeScript is angry about this, so let's ignore that
//@ts-ignore
export default function init() {
	// this needs to run from a function so that we can inject the category types.
	const categories = getCategories();

	// Inject the different options that are available for categories
	manifest.catalogs[0].extra.push({
		name: "genre",
		isRequired: false,
		options: categories
	});

	// build up the addon
	const builder = new addonBuilder(manifest)

	builder.defineCatalogHandler(({type, id, extra}) => {
		const category = extra && extra.genre ? extra.genre : "all";
		console.log("request for catalogs: "+type+" "+id+" "+category+" "+extra?.search);

		let channels = getChannels(category);
		let hasSearchTerm = extra?.search !== undefined;

		// If we're searching for a channel, filter against the keywords
		if (hasSearchTerm) {
			const searchTerm = extra.search.toLowerCase();
			channels = channels.filter(x => x.name.toLowerCase().indexOf(searchTerm) !== -1);
		}

		const metas : MetaPreview[] = channels.map(channel => {
			return {
				id: channel.id,
				type: "tv",
				name: channel.name,

				// note: in the search page, we should show logos; otherwise, they're too big, so hide them and show the text
				poster: channel.logo,
				posterShape: "landscape",
				background: channel.logo
			}
		});
		// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
		return Promise.resolve({ metas })
	})

	builder.defineStreamHandler(({type, id}) => {
		console.log("request for streams: "+type+" "+id)
		const streams = getStreams(id);
		
		// sort the streams
		streams.sort((a, b) => {
			console.log(a.quality, b.quality);
			// if either of the streams don't have a quality, place it later in the list
			if (a.quality === null) {
				return 1;
			}
			if (b.quality === null) {
				return -1;
			}

			// sort the streams by quality
			return parseInt(b.quality) - parseInt(a.quality);
		})

		// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
		// add data to the streams
		return Promise.resolve({ streams: streams.map(x => {
			return {
				url: x.url,
				name: x.quality,
				title: id
			}
		}) })
	})

	return builder.getInterface()

}