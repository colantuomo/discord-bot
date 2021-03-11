"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const custom_error_1 = __importDefault(require("../../shared/custom-error"));
const playList_1 = __importDefault(require("../playList"));
/**
 * Concrete Strategies implement the algorithm while following the base SongStrategy
 * interface. The interface makes them interchangeable in the YouTubeSong.
 */
class SongByLink {
    constructor() {
        this.getSongInfo = async (content) => {
            const url = content;
            const isPlaylist = url.includes('&list=');
            if (isPlaylist) {
                return this.playlist.getPlaylistSongs(url);
            }
            const songInfo = await ytdl_core_1.default.getBasicInfo(url.toString()).catch((err) => {
                console.log(err.message);
                throw new custom_error_1.default('Não foi possível encontrar um vídeo a partir desta URL', 'Execution Error');
            });
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                volume: 0.05,
            };
            console.log('SONG', song);
            return [song];
        };
        this.playlist = new playList_1.default();
    }
}
exports.default = SongByLink;
