"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = __importDefault(require("../search"));
class SongByName {
    constructor(server, userId, nextMusic) {
        this.getSongInfo = async (content) => {
            const songsOptions = await this.search.getSongsByTitle(content);
            this.search.saveUserSearchOptions(this.userId, songsOptions, this.nextMusic);
            this.search.showOptions(songsOptions);
            return [];
        };
        this.search = new search_1.default(server);
        this.userId = userId;
        this.nextMusic = nextMusic;
    }
}
exports.default = SongByName;
