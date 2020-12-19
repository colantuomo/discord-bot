import { Song } from "./song.model";

/**
 * The YouTubeSong uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
interface SongStrategy {
    getSongInfo(content: string): Promise<Array<Song>>;
}

export { SongStrategy };
