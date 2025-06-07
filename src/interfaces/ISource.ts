/* Represents a single stream source. */

interface ISource {
    id: string,
    name: string,
    categories: string[],
    streams: string[]
}