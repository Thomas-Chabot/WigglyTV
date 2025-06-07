import axios from 'axios';
import { TChannel } from 'src/types';

/* This script manages fetching content from the source material. */
const IPTV_CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json';
const IPTV_STREAMS_URL = 'https://iptv-org.github.io/api/streams.json';
const IPTV_GUIDES_URL = 'https://iptv-org.github.io/api/guides.json';

// Global mapping of all channels by their id. This allows us to update the data for a channel and apply it globally.
const channelsById : {[name: string]: ISource[]} = { };

// Channels is a list of every channel within a certain category.
// All channels will be added to a main category (categorized "all"), and then a list of sub-categories.
const channels : {[category: string]: ISource[]} = { };

// List of categories. This contains every channel type.
const categories: string[] = [ ];

const CATEGORY_ALL = "all";

// Maps a Channel from the API -> Internal Source format.
function buildChannelSource(channel: TChannel): ISource {
    channel.categories.push(CATEGORY_ALL);
    return {
        id: channel.id,
        name: channel.name,
        categories: channel.categories,
        streams: []
    };
}

// Fetch the main data.
async function fetchChannels() {
    const channelsData = await axios.get(IPTV_CHANNELS_URL);
    for (var channel of channelsData.data) {
        const sourceData = buildChannelSource(channel);

        // Add the channel into our channels array
        if (channelsById[sourceData.id] == undefined) {
            channelsById[sourceData.id] = [ ];
        }
        channelsById[sourceData.id].push(sourceData);

        // update every category with this channel
        for (var category of sourceData.categories) {
            if (channels[category] === undefined) {
                channels[category] = [];
                categories.push(category);
            }
            channels[category].push(sourceData);
        }
    }
}

export async function initContent() {
    await fetchChannels();
}