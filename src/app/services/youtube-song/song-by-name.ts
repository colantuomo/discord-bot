import { Song } from "../../models/song.model";
import { SongStrategy } from "../../models/youtube-song.model";

export default class SongByName implements SongStrategy {
    getSongInfo = async (content: string): Promise<Array<Song>> => {
        return [];
    }
}
