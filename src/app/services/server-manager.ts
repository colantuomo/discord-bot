import { DMChannel, Message, NewsChannel, TextChannel, VoiceChannel } from 'discord.js';
import { Server } from '../models/server-manager.model';
import { Song } from '../models/song.model';
import CustomError from '../shared/custom-error';
import ServerManagerUtils from '../utils/server-manager.utils';
import Favorites from '../services/favorites';

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
            playing: false,
            searchSession: {},
            favorites: {},
        };

        this.servers.set(serverId, server);

        return this.servers.get(serverId)!;
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
        this.servers.get(serverId)!.playing = true;
        nextMusic ? this.servers.get(serverId)!.songs.splice(1, 0, ...songList) : this.servers.get(serverId)!.songs.push(...songList);
    }

    startNewServer = async (message: Message): Promise<Server> => {
        try {
            ServerManagerUtils.validateServerConf(message);
            const serverId = message.guild!.id;
            const textChannel = message.channel;
            const voiceChannel = message.member!.voice.channel!;

            const server = await this.connect(serverId, textChannel, voiceChannel);

            const favorites = new Favorites(serverId);
            const favoriteObject = await favorites.getFavoritesMap();

            server.favorites = favoriteObject;

            return server;
        } catch (err) {
            if (err.type === 'Custom')
                throw err;

            console.log('== startNewServer Error: ', err);
            throw new CustomError("Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ", "Execution Error");
        }
    }
}

export default ServerManager;
