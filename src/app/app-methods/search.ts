import YoutubeService from '../../service/youtube.service';
import Formatter from '../formatter/formatter';
class Search {

    searchSession: any;

    getSearchSession() {
        return this.searchSession;
    }

    setSearchSession(searchSession: any) {
        this.searchSession = searchSession;
    }

    async search(message: any) {
        const idResponse: any = await YoutubeService.get(Formatter.formatMessage(message.content));
    
        if (idResponse.status == 403) {
            console.log('Limite diário de requisições atingidas (/SEARCH)');
            return;
        }
    
        const idList = idResponse.data.items.map((video: any) => {
            return video.id.videoId;
        });
    
        const videoResponse: any = await YoutubeService.getById(idList);
    
        if (videoResponse.status == 403) {
            console.log('Limite diário de requisições atingidas (/VIDEOS)');
            return;
        }
    
        this.showOptions(message, videoResponse);
    }

    showOptions(message: any, videosList: any){
        let msg = '';
        new Promise(resolve => {
            let userId = message.author.id;
    
            videosList.data.items.forEach((video: any, i: number) => {
                let title = video.snippet.title;
                let channelTitle = video.snippet.channelTitle;
                let duration = Formatter.formatDuration(video.contentDetails.duration);
                let index = i + 1;
                msg += `${index}. ${title} | ${channelTitle} (${duration})\r\n`;
                //Recriando objeto sempre que o usuário fizer uma nova busca
                if (index == 1){
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