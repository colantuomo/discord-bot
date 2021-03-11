"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_service_1 = __importDefault(require("../apis/youtube.service"));
const custom_error_1 = __importDefault(require("../shared/custom-error"));
class Playlist {
    constructor() {
        this.getPlaylistSongs = async (url) => {
            const songList = [];
            //pega apenas a url do youtube e manda para o metodo getPlaylistData para pegar a lista de musicas
            const playlistData = await this.getPlaylistData(url);
            let nextPageToken = playlistData.nextPageToken;
            const numberPages = (playlistData.pageInfo.totalResults / playlistData.pageInfo.resultsPerPage);
            for (let page = 1; page <= numberPages; page++) {
                const newPage = await this.getPlaylistData(url, nextPageToken);
                nextPageToken = newPage.nextPageToken;
                playlistData.items.push(...newPage.items);
            }
            // Faz um for na lista de musicas para pegar o nome e url do video
            for (let item of playlistData.items) {
                const linkYoutube = 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId + '&playlists=' + item.snippet.playlistId;
                const song = {
                    title: item.snippet.title,
                    url: linkYoutube,
                    volume: 0.05
                };
                songList.push(song);
            }
            return songList;
        };
        this.getPlaylistData = async (url, nextPageToken = "") => {
            try {
                const result = await this.youtube.getPlaylist(url, nextPageToken);
                return result.data;
            }
            catch (err) {
                throw new custom_error_1.default("Então meu querido, deu um erro aqui para identificar o id dessa playlist. Tenta de novo, mas se não der não deu.", 'API YouTube Error');
            }
        };
        this.youtube = new youtube_service_1.default();
    }
}
exports.default = Playlist;
