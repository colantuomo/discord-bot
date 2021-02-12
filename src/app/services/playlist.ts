import YoutubeService from '../apis/youtube.service';
import { Song } from '../models/song.model';
import CustomError from '../shared/custom-error';

export default class Playlist {
    youtube: YoutubeService;

    constructor() {
        this.youtube = new YoutubeService();
    }

    getPlaylistSongs = async (url: string): Promise<Array<Song>> => {
        const songList: Array<Song> = [];

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
    }

    private getPlaylistData = async (url: string, nextPageToken: string = ""): Promise<any> => {
        try {
            const result = await this.youtube.getPlaylist(url, nextPageToken);
            return result.data;
        } catch (err) {
            throw new CustomError("Então meu querido, deu um erro aqui para identificar o id dessa playlist. Tenta de novo, mas se não der não deu.", 'API YouTube Error');
        }
    }
}
