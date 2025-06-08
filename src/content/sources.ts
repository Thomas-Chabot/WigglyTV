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

// Fetches the streams so that we can display them.
async function fetchStreams() {
    const streams = await axios.get(IPTV_STREAMS_URL);
    for (var stream of streams.data) {
        // skip it if the channel is null
        if (stream.channel === null) {
            continue;
        }

        // add the stream
        channels.addStream(stream.channel, stream);
    }
}

// Fetches live streams for a channel.
export async function fetchStreamsForChannel(channelId: string) {
    const streams = await axios.get(IPTV_STREAMS_URL);
    return streams.data.filter((x: any) => x.channel === channelId);
}

// Initializes the data.
export async function initContent() {
    await fetchChannels();
    await fetchStreams();
    channels.mapChannelsIntoCategories();
}
export async function reloadStreams() {
    // reset all channel streams
    channels.resetChannels();

    // refetch streams
    await fetchStreams();
}