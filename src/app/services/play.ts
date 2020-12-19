import ytdl from 'ytdl-core';
import ServerManager from './server-manager';
import Search from './search';
import { environment } from '../../infra/environment';
import { Server } from '../models/server-manager.model';
import { Message, BroadcastDispatcher, StreamDispatcher } from 'discord.js';
import PlayUtils from '../utils/play.utils';
import YouTubeSong from './youtube-song/youtube-song';
import SongByLink from './youtube-song/song-by-link';
import SongByName from './youtube-song/song-by-name';
import { Song } from '../models/song.model';
import CustomError from '../shared/custom-error';

export default class Play {
    private utils: PlayUtils;
    private search: Search
    private serverManager: ServerManager;
    private server: Server | undefined;

    constructor(serverId?: string) {
        this.serverManager = ServerManager.getInstance();
        this.server = serverId ? this.serverManager.get(serverId) : undefined;
        this.utils = new PlayUtils();
        this.search = new Search();
    }

    handlePlayCommand = async (message: Message, nextMusic: boolean): Promise<void> => {
        try {
            this.utils.validateServerConf(message);

            const content = message.content;
            const isLink = this.utils.isLink(content);
            const strategy = isLink ? new SongByLink() : new SongByName();
            const context = new YouTubeSong(strategy);
            const songList = await context.getSongList(content);

            if (!this.server) {
                await this.startNewServer(message);
                this.addSongsToServerQueue(songList, nextMusic);
                this.execute(songList[0]);
            } else {
                this.addSongsToServerQueue(songList, nextMusic);
            }
        }
        catch (err) {
            const errormessage = err.type && err.type === 'Custom' ? err.message : 'Erro ao tocar música escolhida :(';

            message.channel.send(errormessage);
        }
    }

    execute = (song: Song | undefined): void => {
        const serverId = this.server!.serverId;
        if (!song) {
            this.server!.voiceChannel.leave();
            this.serverManager.disconnect(serverId);
            return;
        }

        const streamOptions: ytdl.downloadOptions = {
            quality: 'highestaudio',
            filter: 'audioonly',
            highWaterMark: 1 << 25,
        }
        const stream = ytdl(song.url, streamOptions);
        const dispatcher: StreamDispatcher = this.server!.connection.play(stream);
        const actualSong = this.server!.songs[0];

        dispatcher.setVolume(actualSong.volume);
        dispatcher.on('finish', () => {
            this.server!.songs.shift();
            this.execute(this.server!.songs[0]);
        }).on('error', (error: any) => {
            console.error('== execute error: ', error);
            this.server!.songs.shift();
            this.execute(this.server!.songs[0]);
        });
    }

    pause = (): boolean => {
        if (!this.server)
            throw new CustomError("Não tem nenhuma música tocando para ser pausada");

        const dispatcher: StreamDispatcher = this.server!.connection.dispatcher;
        dispatcher.paused ? dispatcher.resume() : dispatcher.pause();
        return dispatcher.paused;
    }

    // playSearch = (message: any, nextMusic: Boolean) => {
    //     const userId = message.author.id;
    //     const msg = message.content.replace(environment.prefix, "");

    //     if (parseInt(msg) > 5 || parseInt(msg) < 1) {
    //         message.channel.send("This number isn't on the list.");
    //     } else {
    //         const searchSession = this.search.getSearchSession();
    //         let videoId = searchSession[userId][msg];
    //         message.content = environment.prefix + 'play ' + 'https://www.youtube.com/watch?v=' + videoId;
    //         this.play(message, nextMusic);
    //     }
    // }

    private startNewServer = async (message: Message): Promise<void> => {
        try {
            const serverId = message.guild!.id;
            const textChannel = message.channel;
            const voiceChannel = message.member!.voice.channel!;

            this.server = await this.serverManager.connect(serverId, textChannel, voiceChannel);
        } catch (err: any) {
            this.serverManager.disconnect(message.guild!.id);

            console.log('== startNewServer Error: ', err);
            throw new CustomError("Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ", "Execution Error");
        }
    }

    private addSongsToServerQueue = async (songs: Array<Song>, nextMusic: boolean): Promise<void> => {
        this.serverManager.enqueueSongs(this.server!.serverId, songs, nextMusic);

        // Ver a possibilidade de implementar o design pattern observer para retornar mensagens
        const responseMessage = songs.length > 1 ? 'As músicas foram adicionadas a fila!' : `${songs[0].title} foi adicionado a fila!`;
        this.server!.textChannel.send(responseMessage);
    }
}
