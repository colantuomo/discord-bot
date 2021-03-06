import environment from '../../infra/environment';
import YoutubeService from '../../service/youtube.service';
import Formatter from '../formatter/formatter';

class Search {

    searchSession: any = {};
    lastCommand: any = {};

    getSearchSession() {
        return this.searchSession;
    }

    setSearchSession(searchSession: any) {
        this.searchSession = searchSession;
    }

    getLastCommandById(userId: string): String {
        return this.lastCommand[userId];
    }

    setLastCommand(userId: string, command: string) {
        this.lastCommand[userId] = command;
    }

    async search(message: any) {
        try {
            const userId = message.author.id;
            this.setLastCommand(userId, message.content.split(' ')[0].replace(environment.prefix, ''));

            const result: any = await YoutubeService.get(Formatter.formatMessage(message.content));

            const idList = result.data.items.map((video: any) => {
                return video.id.videoId;
            });

            const videoList: any = [];
            for (let item of idList) {
                const result: any = await YoutubeService.getById(item);
                videoList.push(...result.data.items);
            }
            this.showOptions(message, videoList);
        } catch (error) {
            console.log('== Error: ', error);
        }
    }

    showOptions(message: any, videosList: any) {
        const userId = message.author.id;
        let msg = '';
        new Promise(resolve => {
            //Recriando objeto sempre que o usuário fizer uma nova busca
            this.searchSession[userId] = {};

            videosList.forEach((video: any, i: number) => {
                let title = video.snippet.title;
                let channelTitle = video.snippet.channelTitle;
                let duration = Formatter.formatDuration(video.contentDetails.duration);
                let index = i + 1;
                msg += `${index}. ${title} | ${channelTitle} (${duration})\r\n`;
                this.searchSession[userId][index] = video.id;
            });

            return resolve(msg);
        }).then(
            res => {
                message.channel.send("```" + res + "```");
            }, error => {
                message.channel.send('Erro ao exibir lista de vídeos encontrados.');
                console.log('showOptions', error);
            }
        );
    }

}

const instance = new Search();
export = instance;