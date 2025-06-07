import { addonBuilder, MetaPreview, serveHTTP } from "stremio-addon-sdk";
import manifest from "../manifest.json"
import { getChannels } from "./content";

// note: TypeScript is angry about this, so let's ignore that
//@ts-ignore
const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(({type, id, extra}) => {
	console.log("request for catalogs: "+type+" "+id)
	const channels = getChannels("all");
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
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
	// return no streams
	return Promise.resolve({ streams: [] })
})

export default builder.getInterface()