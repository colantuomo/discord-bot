import axios from 'axios';
import environment from '../infra/environment';

class YoutubeService {
    get(message: any) {
        return axios.get(environment.googleBaseURL + '/search', {
            params: {
                part: "snippet",
                q: message,
                key: environment.apiKey,
                access_token: environment.authToken,
                type: "video",
                maxResults: 5
            },
            responseType: 'json'
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

    getById(id: string) {
        return axios.get(environment.googleBaseURL + '/videos', {
            params: {
                key: environment.apiKey,
                access_token: environment.authToken,
                part: "snippet,contentDetails",
                id: id
            },
            responseType: 'json'
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

    getPlaylist(url: string, pageToken: string) {
        const regexp = new RegExp('\list=(.*)\&').exec(url);
        let playlistId = '';
        if (regexp) {
            playlistId = regexp[1];
        }
        return axios.get(`${environment.googleBaseURL}/playlistItems`, {
            params: {
                key: environment.apiKey,
                part: "snippet",
                playlistId: playlistId,
                pageToken: pageToken 
            },
            responseType: 'json'
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

}

const instance = new YoutubeService();
export = instance;