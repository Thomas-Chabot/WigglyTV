import { channel } from "diagnostics_channel";
import { TChannel } from "src/types";

const CATEGORY_ALL = "all";

// Global mapping of all channels by their id. This allows us to update the data for a channel and apply it globally.
const channelsById : {[name: string]: ISource} = { };

// Channels is a list of every channel within a certain category.
// All channels will be added to a main category (categorized "all"), and then a list of sub-categories.
const channels : {[category: string]: ISource[]} = { };

// List of categories. This contains every channel type.
const categories: string[] = [ ];
const existingCategories: {[category: string]: boolean} = { }

// Adds a channel to the list of available sources.
export function addChannel(channel: TChannel) {
    // Create the channel data
    const source = mapChannel(channel);

    // Add the channel into our main list
    channelsById[source.id] = source;
}

// Retrieve the list of all categories.
export function getCategories() {
    return categories;
}

// Retrieve the list of channels for a category.
export function getChannels(category: string) {
    return channels[category];
}

// Adds a stream to a channel. The channel should already exist.
export function addStream(channelId: string, streamData: IStream) {
    const channelSource = channelsById[channelId];
    console.assert(channelSource !== undefined, `Could not find channel: ${channelId}`);
    channelSource?.streams.push(streamData);
}

// Called to map the channels into their individual categories. This should run after all streams have been added.
// This happens later in the process so that we can take out any channels that don't have streams available.
export function mapChannelsIntoCategories() {
    for (var channelId in channelsById) {
        var channel = channelsById[channelId];
        if (channel.streams.length === 0) {
            // Skip the channel if it doesn't have any streams
            continue;
        }

        // Otherwise we have at least 1 stream, so we can add it to the list
        for (var category of channel.categories) {
            addToList(channels, category, channel);
            if (!existingCategories[category]) {
                existingCategories[category] = true;
                categories.push(category);
            }
        }
    }
}

// Maps a channel to the ISource format.
function mapChannel(channel: TChannel): ISource {
    channel.categories.push(CATEGORY_ALL);
    return {
        id: channel.id,
        name: channel.name,
        categories: channel.categories,
        streams: []
    };
}

// Helper method, adds a channel to a list. First checks if the list exists and initializes it if not.
function addToList(sourceMap: {[dataKey: string]: ISource[]}, key: string, channel: ISource) {
    if (sourceMap[key] === undefined) {
        sourceMap[key] = [];
    }
    sourceMap[key].push(channel);
}
