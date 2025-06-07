import axios from 'axios';
import * as channels from "./channels";

/* This script manages fetching content from the source material. */
const IPTV_CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json';
const IPTV_STREAMS_URL = 'https://iptv-org.github.io/api/streams.json';
const IPTV_GUIDES_URL = 'https://iptv-org.github.io/api/guides.json';

// Fetch the main data.
async function fetchChannels() {
    const channelsData = await axios.get(IPTV_CHANNELS_URL);
    for (var channel of channelsData.data) {
        channels.addChannel(channel);
    }
}

// Initializes the data.
export async function initContent() {
    await fetchChannels();
    console.log(channels.getCategories());
}