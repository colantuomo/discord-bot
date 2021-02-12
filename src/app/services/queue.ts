import { Message } from "discord.js";
import { Server } from '../models/server-manager.model';
import ServerManager from './server-manager';
import QueueUtils from '../utils/queue.utils';

export default class Queue {
    serverMap: ServerManager;
    utils: QueueUtils;

    constructor() {
        this.serverMap = ServerManager.getInstance();
        this.utils = new QueueUtils();
    }

    skip = (serverId: string): void => {
        const server = this.serverMap.get(serverId);
        this.finishStream(server!);
    }

    stop = (serverId: string): void => {
        const server = this.serverMap.get(serverId);
        server!.textChannel.send('Bye bye! :)');
        server!.songs = [];
        this.finishStream(server!);
    }

    songs = (serverId: string): void => {
        const server: Server = this.serverMap.get(serverId)!;
        let resultMessage = '```autohotkey\r\n';

        if (server?.songs.length > 0) {
            server!.songs.forEach((song: any, idx: number) => {
                if (idx === 0) {
                    resultMessage += `
===============================================
TOCANDO AGORA: ${song.title}
===============================================
PRÓXIMAS NA FILA:
===============================================
`;
                } else {
                    resultMessage += `${idx < 10 ? '0' + idx : idx} - ${song.title}\r\n`;
                }
            });
        } else {
            resultMessage += 'Nenhum item na fila';
        }

        resultMessage += '```';
        server.textChannel.send(resultMessage);
    }

    setVolume = (serverId: string, volume: string): void => {
        const newVolume = this.utils.getVolume(volume);

        this.serverMap.get(serverId)!.connection.dispatcher.setVolume(newVolume);
    }

    validQueueParams = (message: Message): boolean => {
        return (this.utils.validMember(message) && this.utils.validQueue(message));
    }

    private finishStream = (server: Server): void => {
        server.connection?.dispatcher?.end();
    }
}
