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
	//@ts-ignore
	manifest.catalogs[0].extra.push({
		name: "genre",
		isRequired: false,
		options: categories
	});

	// build up the addon
	//@ts-ignore
	const builder = new addonBuilder(manifest)

	builder.defineCatalogHandler(({type, id, extra}) => {
		const category = extra && extra.genre ? extra.genre : "all";

		console.log("request for catalogs: "+type+" "+id+" "+category);

		const channels = getChannels(category);
		const metas : MetaPreview[] = channels.map(channel => {
			return {
				id: channel.id,
				type: "tv",
				name: channel.name,
				poster: channel.logo
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