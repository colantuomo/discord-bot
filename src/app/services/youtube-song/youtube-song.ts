import { Song } from "../../models/song.model";
import { SongStrategy } from "../../models/youtube-song.model";

/**
 * The YouTubeSong defines the interface of interest to clients.
 */
export default class YouTubeSong {
    /**
     * @type {SongStrategy} The YouTubeSong maintains a reference to one of the SongStrategy
     * objects. The YouTubeSong does not know the concrete class of a strategy. It
     * should work with all strategies via the SongStrategy interface.
     */
    private strategy: SongStrategy;

    /**
     * Usually, the YouTubeSong accepts a strategy through the constructor, but also
     * provides a setter to change it at runtime.
     */
    constructor(strategy: SongStrategy) {
        this.strategy = strategy;
    }

    /**
     * Usually, the YouTubeSong allows replacing a SongStrategy object at runtime.
     */
    public setSongStrategy(strategy: SongStrategy) {
        this.strategy = strategy;
    }

    /**
     * The YouTubeSong delegates some work to the SongStrategy object instead of
     * implementing multiple versions of the algorithm on its own.
     */
    public getSongList = async (content: string): Promise<Array<Song>> => {
        return this.strategy.getSongInfo(content);
    }
}
