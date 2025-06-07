import axios from 'axios';

/* This script manages fetching content from the source material. */
const IPTV_CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json';
const IPTV_STREAMS_URL = 'https://iptv-org.github.io/api/streams.json';
const IPTV_GUIDES_URL = 'https://iptv-org.github.io/api/guides.json';

// Channels is a list of every channel within a certain category.
// All channels will be added to a main category (categorized "all"), and then a list of sub-categories.
const channels : {[category: string]: ISource[]} = { };

// List of categories. This contains every channel type.
const categories: string[] = [ ];

// Fetch the main data.
export async function initContent() {
    const channelsData = await axios.get(IPTV_CHANNELS_URL);
    for (var channel of channelsData.data) {
        console.log(channel.id);
    }

}