import QueueService from './server-manager'
import Discord from 'discord.js'

export default class Skip {
    private queueService: QueueService;

    constructor() {
        this.queueService = QueueService.getInstance();
    }
    skip = (message: Discord.Message): void => {
        if (!message.member?.voice.channel) {
            message.channel.send('You have to be in a voice channel to stop the music!');
            return;
        }
        if (!this.queueService) {
            message.channel.send('There is no song that I could skip!');
            return;
        }
        const guildId = message.guild!.id;
        const queue = this.queueService.get(guildId);
        queue?.connection.dispatcher.end();
    }
}
