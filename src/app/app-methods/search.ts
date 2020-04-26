import YoutubeService from '../../service/youtube.service';
import Formatter from '../formatter/formatter';
class Search {

    searchSession: any = {};

    getSearchSession() {
        return this.searchSession;
    }

    setSearchSession(searchSession: any) {
        this.searchSession = searchSession;
    }

    async search(message: any) {
        try {
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
        let msg = '';
        new Promise(resolve => {
            let userId = message.author.id;

            videosList.forEach((video: any, i: number) => {
                let title = video.snippet.title;
                let channelTitle = video.snippet.channelTitle;
                let duration = Formatter.formatDuration(video.contentDetails.duration);
                let index = i + 1;
                msg += `${index}. ${title} | ${channelTitle} (${duration})\r\n`;
                //Recriando objeto sempre que o usuário fizer uma nova busca
                if (index == 1) {
                    this.searchSession[userId] = {};
                }
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