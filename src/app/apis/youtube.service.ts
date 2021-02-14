import axios from 'axios';
import { environment } from '../../infra/environment';

export default class YoutubeService {
    async searchSongsByTitle(message: any) {
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
            error = error.response.data.error;
            throw `${error.code} - ${error.message} - ${error.errors.length > 0 ? error.errors[0].reason : 'errors arr is empty'} (/SEARCH)`;
        }
    }

    async getVideoById(id: string) {
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
            error = error.response.data.error;
            throw `${error.code} - ${error.message} - ${error.errors.length > 0 ? error.errors[0].reason : 'errors arr is empty'} (/VIDEOS)`;
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
                    access_token: environment.authToken,
                    pageToken: pageToken
                },
                responseType: 'json'
            });
        }
        catch (error) {
            error = error.response.data.error;
            console.log('errors: ', error.errors);
            throw `${error.code} - ${error.message} - ${error.errors.length > 0 ? error.errors[0].reason : 'errors arr is empty'} (/PLAYLISTITEMS)`;
        }
    }

}
