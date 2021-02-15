import ytdl from 'ytdl-core';
import ServerManager from './server-manager';
import { Server } from '../models/server-manager.model';
import { StreamDispatcher } from 'discord.js';
import PlayUtils from '../utils/play.utils';
import YouTubeSong from './youtube-song/youtube-song';
import SongByLink from './youtube-song/song-by-link';
import SongByName from './youtube-song/song-by-name';
import { SearchSong, Song } from '../models/song.model';
import CustomError from '../shared/custom-error';
import { SearchObject } from '../models/search.model';
import Volume from '../services/volume';

export default class Play {
    private serverManager: ServerManager;
    private server: Server;

    constructor(serverId: string) {
        this.serverManager = ServerManager.getInstance();
        this.server = this.serverManager.get(serverId)!;
    }

    handlePlayCommand = async (userId: string, content: string, nextMusic: boolean, volume: string = '5'): Promise<void> => {
        const isLink: boolean = PlayUtils.isLink(content);
        const strategy: SongByLink | SongByName = isLink ? new SongByLink() : new SongByName(this.server, userId, nextMusic);
        const context: YouTubeSong = new YouTubeSong(strategy);
        let songList: Array<Song> = await context.getSongList(content);

        if (songList.length === 0) return;

        if (volume !== '5')
            songList = this.playWithCustomVolume(songList, volume);

        !this.server.playing ? (() => {
            this.addSongsToServerQueue(songList, nextMusic);
            this.execute(songList[0]);
        })() :
            this.addSongsToServerQueue(songList, nextMusic);
    }

    execute = (song: Song | undefined): void => {
        const serverId = this.server!.serverId;
        this.server.playing = true;

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

    playSearch = async (userId: string, option: number): Promise<void> => {
        if (option < 1 || option > 5) {
            this.server.textChannel.send("This number isn't on the list.");
            return;
        }

        let userSearchSession: SearchObject = this.server.searchSession[userId];
        const nextMusic: boolean = !!userSearchSession.nextMusic;
        const videoId = userSearchSession.options?.filter((song: SearchSong) => song.index === option)[0].id;
        this.server.searchSession[userId] = {};

        const content = `https://www.youtube.com/watch?v=${videoId}`;
        await this.handlePlayCommand(userId, content, nextMusic);
    }

    private addSongsToServerQueue = async (songs: Array<Song>, nextMusic: boolean): Promise<void> => {
        this.serverManager.enqueueSongs(this.server!.serverId, songs, nextMusic);

        // Ver a possibilidade de implementar o design pattern observer para retornar mensagens
        const responseMessage = songs.length > 1 ? 'As músicas foram adicionadas a fila!' : `${songs[0].title} foi adicionado a fila!`;
        this.server!.textChannel.send(responseMessage);
    }

    private playWithCustomVolume = (songList: Array<Song>, volume: string): Array<Song> => {
        return songList.map((song: Song) => (
            {
                title: song.title,
                url: song.url,
                volume: Volume.getVolume(volume),
            }
        ));
    }
}
