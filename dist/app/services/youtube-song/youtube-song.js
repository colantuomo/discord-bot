"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The YouTubeSong defines the interface of interest to clients.
 */
class YouTubeSong {
    /**
     * Usually, the YouTubeSong accepts a strategy through the constructor, but also
     * provides a setter to change it at runtime.
     */
    constructor(strategy) {
        /**
         * The YouTubeSong delegates some work to the SongStrategy object instead of
         * implementing multiple versions of the algorithm on its own.
         */
        this.getSongList = async (content) => {
            return this.strategy.getSongInfo(content);
        };
        this.strategy = strategy;
    }
    /**
     * Usually, the YouTubeSong allows replacing a SongStrategy object at runtime.
     */
    setSongStrategy(strategy) {
        this.strategy = strategy;
    }
}
exports.default = YouTubeSong;
