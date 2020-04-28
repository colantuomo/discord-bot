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
        const userId = message.author.id;
        this.setLastCommand(userId, message.content.split(' ')[0].replace(environment.prefix, ''));

        const idResponse: any = await YoutubeService.get(Formatter.formatMessage(message.content));
        if (idResponse.status == 403) {
            console.log('Limite diário de requisições atingidas (/SEARCH)');
            return;
        }

        const idList = idResponse.data.items.map((video: any) => {
            return video.id.videoId;
        });

        const videoList: any = [];
        for (let item of idList) {
            const result: any = await YoutubeService.getById(item);
            if (result.status == 403) {
                console.log('Limite diário de requisições atingidas (/VIDEOS)');
                return;
            }
            videoList.push(...result.data.items);
        }
        this.showOptions(message, videoList);
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