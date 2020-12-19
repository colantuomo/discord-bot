import { Message } from "discord.js";
import ServerManager from "../services/server-manager";

export default class QueueUtils {
    serverMap: ServerManager;

    constructor() {
        this.serverMap = ServerManager.getInstance();
    }

    validMember = (message: Message): boolean => {
        if (!message.member?.voice.channel) {
            message.channel.send('You have to be in a voice channel to stop the music!');
            return false;
        }
        return true;
    }

    validQueue = (message: Message): boolean => {
        const serverId = message.guild!.id;
        const server = this.serverMap.get(serverId);

        if (!server || server.songs.length === 0) {
            message.channel.send('There is no music playing.');
            return false;
        }

        return true;
    }

    getVolume(volumeIndex: string): number {
        const volumeDict: any = {
            '1': 0.01,
            '2': 0.02,
            '3': 0.03,
            '4': 0.04,
            '5': 0.05,
            '6': 0.10,
            '7': 0.20,
            '8': 0.30,
            '9': 0.40,
            '10': 0.50,
            '11': 0.60,
            '12': 0.70,
            '13': 0.80,
            '14': 0.90,
            '15': 1.00,
        }

        return volumeDict[volumeIndex]
    }
}
