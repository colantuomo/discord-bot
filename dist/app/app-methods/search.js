"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const environment_1 = __importDefault(require("../../infra/environment"));
const youtube_service_1 = __importDefault(require("../../service/youtube.service"));
const formatter_1 = __importDefault(require("../formatter/formatter"));
class Search {
    constructor() {
        this.searchSession = {};
        this.lastCommand = {};
    }
    getSearchSession() {
        return this.searchSession;
    }
    setSearchSession(searchSession) {
        this.searchSession = searchSession;
    }
    getLastCommandById(userId) {
        return this.lastCommand[userId];
    }
    setLastCommand(userId, command) {
        this.lastCommand[userId] = command;
    }
    async search(message) {
        try {
            const userId = message.author.id;
            this.setLastCommand(userId, message.content.split(' ')[0].replace(environment_1.default.prefix, ''));
            const result = await youtube_service_1.default.get(formatter_1.default.formatMessage(message.content));
            const idList = result.data.items.map((video) => {
                return video.id.videoId;
            });
            const videoList = [];
            for (let item of idList) {
                const result = await youtube_service_1.default.getById(item);
                videoList.push(...result.data.items);
            }
            this.showOptions(message, videoList);
        }
        catch (error) {
            console.log('== Error: ', error);
        }
    }
    showOptions(message, videosList) {
        const userId = message.author.id;
        let msg = '';
        new Promise(resolve => {
            //Recriando objeto sempre que o usuário fizer uma nova busca
            this.searchSession[userId] = {};
            videosList.forEach((video, i) => {
                let title = video.snippet.title;
                let channelTitle = video.snippet.channelTitle;
                let duration = formatter_1.default.formatDuration(video.contentDetails.duration);
                let index = i + 1;
                msg += `${index}. ${title} | ${channelTitle} (${duration})\r\n`;
                this.searchSession[userId][index] = video.id;
            });
            return resolve(msg);
        }).then(res => {
            message.channel.send("```" + res + "```");
        }, error => {
            message.channel.send('Erro ao exibir lista de vídeos encontrados.');
            console.log('showOptions', error);
        });
    }
}
const instance = new Search();
module.exports = instance;
