"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_service_1 = __importDefault(require("../apis/youtube.service"));
const custom_error_1 = __importDefault(require("../shared/custom-error"));
const formatter_1 = __importDefault(require("../utils/formatter/formatter"));
class Search {
    constructor(server) {
        this.getSongsByTitle = async (content) => {
            try {
                const searchResponse = await this.youtube.searchSongsByTitle(content);
                const videoIdList = searchResponse.data.items.map((video) => video.id.videoId);
                const result = [];
                let idx = 1;
                for (const id of videoIdList) {
                    const videoResponse = await this.youtube.getVideoById(id);
                    const data = videoResponse.data.items[0];
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
            }
            catch (error) {
                console.log('== Error: ', error);
                throw new custom_error_1.default("Falai capoeirista, deu um problema na busca aqui.", 'API YouTube Error');
            }
        };
        this.saveUserSearchOptions = (userId, options, nextMusic) => {
            this.server.searchSession[userId] = {
                options,
                nextMusic
            };
        };
        this.server = server;
        this.youtube = new youtube_service_1.default();
        this.formatter = new formatter_1.default();
    }
    showOptions(options) {
        let resultMessage = '```autohotkey\r\n';
        options.forEach((video) => {
            resultMessage += `${video.index}. ${video.title} | ${video.channelTitle} (${video.duration})\r\n`;
        });
        resultMessage += '```';
        this.server.textChannel.send(resultMessage);
    }
}
exports.default = Search;
