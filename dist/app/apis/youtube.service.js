"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const environment_1 = require("../../infra/environment");
class YoutubeService {
    async searchSongsByTitle(message) {
        try {
            return await axios_1.default.get(environment_1.environment.googleBaseURL + '/search', {
                params: {
                    part: "snippet",
                    q: message,
                    key: environment_1.environment.apiKey,
                    access_token: environment_1.environment.authToken,
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
    async getVideoById(id) {
        try {
            return await axios_1.default.get(environment_1.environment.googleBaseURL + '/videos', {
                params: {
                    key: environment_1.environment.apiKey,
                    access_token: environment_1.environment.authToken,
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
    async getPlaylist(url, pageToken) {
        try {
            const regexp = new RegExp('\list=(.*)\&').exec(url);
            let playlistId = '';
            if (regexp) {
                playlistId = regexp[1];
            }
            return await axios_1.default.get(`${environment_1.environment.googleBaseURL}/playlistItems`, {
                params: {
                    key: environment_1.environment.apiKey,
                    part: "snippet",
                    playlistId: playlistId,
                    access_token: environment_1.environment.authToken,
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
exports.default = YoutubeService;
