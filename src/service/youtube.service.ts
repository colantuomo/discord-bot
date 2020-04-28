import axios from 'axios';
import environment from '../infra/environment';

class YoutubeService {
    async get(message: any) {
        try {
            return await axios.get(environment.googleBaseURL + '/search', {
                params: {
                    part: "snippet",
                    q: message,
                    key: environment.apiKey,
                    access_token: environment.authToken,
                    type: "video",
                    maxResults: 5
                },
                responseType: 'json'
            });
        }
        catch (error) {
            throw error + ' (/SEARCH)';
        }
    }

    async getById(id: string) {
        try {
            return await axios.get(environment.googleBaseURL + '/videos', {
                params: {
                    key: environment.apiKey,
                    access_token: environment.authToken,
                    part: "snippet,contentDetails",
                    id: id
                },
                responseType: 'json'
            });
        }
        catch (error) {
            throw error + ' (/VIDEOS)';
        }
    }

    async getPlaylist(url: string, pageToken: string) {
        try {
            const regexp = new RegExp('\list=(.*)\&').exec(url);
            let playlistId = '';
            if (regexp) {
                playlistId = regexp[1];
            }
            return await axios.get(`${environment.googleBaseURL}/playlistItems`, {
                params: {
                    key: environment.apiKey,
                    part: "snippet",
                    playlistId: playlistId,
                    pageToken: pageToken
                },
                responseType: 'json'
            });
        }
        catch (error) {
            throw error + ' (/PLAYLISTITEMS)';
        }
    }

}

const instance = new YoutubeService();
export = instance;