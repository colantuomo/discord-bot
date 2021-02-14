import { AxiosResponse } from 'axios';
import { environment } from '../../infra/environment';
import YoutubeService from '../apis/youtube.service';
import { Server } from '../models/server-manager.model';
import { SearchSong } from '../models/song.model';
import { SearchItem, SearchListResponse, VideoItem, VideoListResponse, } from '../models/youtube-response.model';
import CustomError from '../shared/custom-error';
import Formatter from '../utils/formatter/formatter';
import ServerManager from './server-manager';

export default class Search {
    private youtube: YoutubeService;
    private formatter: Formatter;
    private server: Server;

    constructor(server: Server) {
        this.server = server;
        this.youtube = new YoutubeService();
        this.formatter = new Formatter();
    }

    getSongsByTitle = async (content: string): Promise<Array<SearchSong>> => {
        try {
            const searchResponse: AxiosResponse<SearchListResponse> = await this.youtube.searchSongsByTitle(content);
            const videoIdList: Array<string> = searchResponse.data.items.map((video: SearchItem) => video.id.videoId);

            const result: Array<SearchSong> = [];
            let idx: number = 1;

            for (const id of videoIdList) {
                const videoResponse: AxiosResponse<VideoListResponse> = await this.youtube.getVideoById(id);
                const data: VideoItem = videoResponse.data.items[0];

                const { title, channelTitle } = data.snippet;
                const duration = this.formatter.formatDuration(data.contentDetails.duration);

                result.push({
                    id,
                    index: idx++,
                    title,
                    channelTitle,
                    duration,
                });
            }

            return result;
        } catch (error) {
            console.log('== Error: ', error);
            throw new CustomError("Falai capoeirista, deu um problema na busca aqui.", 'API YouTube Error');
        }
    }

    saveUserSearchOptions = (userId: string, options: Array<SearchSong>, nextMusic: boolean) => {
        this.server.searchSession[userId] = {
            options,
            nextMusic
        };
    }

    showOptions(options: Array<SearchSong>) {
        let resultMessage = '```autohotkey\r\n';

        options.forEach((video: SearchSong) => {
            resultMessage += `${video.index}. ${video.title} | ${video.channelTitle} (${video.duration})\r\n`;
        });

        resultMessage += '```';

        this.server.textChannel.send(resultMessage);
    }
}
