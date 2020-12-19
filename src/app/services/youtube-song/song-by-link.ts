import ytdl from "ytdl-core";
import { Song } from "../../models/song.model";
import { SongStrategy } from "../../models/youtube-song.model";
import Playlist from "../playList";

/**
 * Concrete Strategies implement the algorithm while following the base SongStrategy
 * interface. The interface makes them interchangeable in the YouTubeSong.
 */
export default class SongByLink implements SongStrategy {
    private playlist: Playlist;

    constructor() {
        this.playlist = new Playlist();
    }

    getSongInfo = async (content: string): Promise<Array<Song>> => {
        const url: string = content;
        const isPlaylist: boolean = url.includes('&list=');

        if (isPlaylist) {
            return this.playlist.getPlaylistSongs(url);
        }

        const songInfo = await ytdl.getBasicInfo(url.toString()).catch((error: any) => {
            console.log('== ERROR YTDL: ', error);
            throw new Error('Deu aquele erro la men');
        });

        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            volume: 0.05,
        };

        console.log('SONG', song);
        return [song];
    }
}
