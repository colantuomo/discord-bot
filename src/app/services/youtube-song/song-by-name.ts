import { Server } from "../../models/server-manager.model";
import { Song } from "../../models/song.model";
import { SongStrategy } from "../../models/youtube-song.model";
import Search from "../search";

export default class SongByName implements SongStrategy {
    private search: Search;
    private userId: string;
    private nextMusic: boolean;

    constructor(server: Server, userId: string, nextMusic: boolean) {
        this.search = new Search(server);
        this.userId = userId;
        this.nextMusic = nextMusic;
    }

    getSongInfo = async (content: string): Promise<Array<Song>> => {
        const songsOptions = await this.search.getSongsByTitle(content);
        this.search.saveUserSearchOptions(this.userId, songsOptions, this.nextMusic);
        this.search.showOptions(songsOptions);

        return [];
    }
}
