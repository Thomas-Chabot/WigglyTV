/* Represents a single stream source. */

interface IStream {
    url: string,
    quality: string
}

interface ISource {
    id: string,
    name: string,
    categories: string[],
    streams: IStream[]
}