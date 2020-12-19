import { DMChannel, NewsChannel, TextChannel, VoiceChannel } from 'discord.js';
import { Server } from '../models/server-manager.model';
import { Song } from '../models/song.model';

class ServerManager {
    private static instance: ServerManager;
    servers: Map<string, Server>;

    private constructor() {
        this.servers = new Map<string, Server>();
    }

    public static getInstance(): ServerManager {
        if (!ServerManager.instance) {
            ServerManager.instance = new ServerManager();
        }

        return ServerManager.instance;
    }

    get = (serverId: string): Server | undefined => {
        return this.servers.get(serverId);
    }

    connect = async (serverId: string, textChannel: TextChannel | DMChannel | NewsChannel, voiceChannel: VoiceChannel): Promise<Server> => {
        const connection = await voiceChannel.join();

        const server: Server = {
            serverId: serverId,
            textChannel: textChannel,
            voiceChannel: voiceChannel,
            connection: connection,
            songs: [],
            playing: false, // trocar para Song atual
        };

        this.servers.set(serverId, server);
        const result = this.servers.get(serverId);

        return result!;
    }

    disconnect = (serverId: string): void => {
        const server = this.servers.get(serverId);

        if (server) {
            this.servers.delete(serverId);

            const connection = server?.connection;

            if (connection)
                server.voiceChannel.leave();
        }
    }

    enqueueSongs = (serverId: string, songList: Array<Song>, nextMusic: boolean): void => {
        console.log('QUEUE ANTES: ', this.servers.get(serverId)!.playing);
        this.servers.get(serverId)!.playing = true;
        nextMusic ? this.servers.get(serverId)!.songs.splice(1, 0, ...songList) : this.servers.get(serverId)!.songs.push(...songList);
    }
}

export default ServerManager;
