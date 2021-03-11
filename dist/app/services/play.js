"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const server_manager_1 = __importDefault(require("./server-manager"));
const play_utils_1 = __importDefault(require("../utils/play.utils"));
const youtube_song_1 = __importDefault(require("./youtube-song/youtube-song"));
const song_by_link_1 = __importDefault(require("./youtube-song/song-by-link"));
const song_by_name_1 = __importDefault(require("./youtube-song/song-by-name"));
const custom_error_1 = __importDefault(require("../shared/custom-error"));
const volume_1 = __importDefault(require("../services/volume"));
class Play {
    constructor(serverId) {
        this.handlePlayCommand = async (userId, content, nextMusic, volume = '5') => {
            const isLink = play_utils_1.default.isLink(content);
            const strategy = isLink ? new song_by_link_1.default() : new song_by_name_1.default(this.server, userId, nextMusic);
            const context = new youtube_song_1.default(strategy);
            let songList = await context.getSongList(content);
            if (songList.length === 0)
                return;
            if (volume !== '5')
                songList = this.playWithCustomVolume(songList, volume);
            !this.server.playing ? (() => {
                this.addSongsToServerQueue(songList, nextMusic);
                this.execute(songList[0]);
            })() :
                this.addSongsToServerQueue(songList, nextMusic);
        };
        this.execute = (song) => {
            const serverId = this.server.serverId;
            this.server.playing = true;
            if (!song) {
                this.server.voiceChannel.leave();
                this.serverManager.disconnect(serverId);
                return;
            }
            const streamOptions = {
                quality: 'highestaudio',
                filter: 'audioonly',
                highWaterMark: 1 << 25,
            };
            const stream = ytdl_core_1.default(song.url, streamOptions);
            const dispatcher = this.server.connection.play(stream);
            const actualSong = this.server.songs[0];
            dispatcher.setVolume(actualSong.volume);
            dispatcher.on('finish', () => {
                this.server.songs.shift();
                this.execute(this.server.songs[0]);
            }).on('error', (error) => {
                console.error('== execute error: ', error);
                this.server.songs.shift();
                this.execute(this.server.songs[0]);
            });
        };
        this.pause = () => {
            if (!this.server)
                throw new custom_error_1.default("Não tem nenhuma música tocando para ser pausada");
            const dispatcher = this.server.connection.dispatcher;
            dispatcher.paused ? dispatcher.resume() : dispatcher.pause();
            return dispatcher.paused;
        };
        this.playSearch = async (userId, option) => {
            var _a;
            if (option < 1 || option > 5) {
                this.server.textChannel.send("This number isn't on the list.");
                return;
            }
            let userSearchSession = this.server.searchSession[userId];
            const nextMusic = !!userSearchSession.nextMusic;
            const videoId = (_a = userSearchSession.options) === null || _a === void 0 ? void 0 : _a.filter((song) => song.index === option)[0].id;
            this.server.searchSession[userId] = {};
            const content = `https://www.youtube.com/watch?v=${videoId}`;
            await this.handlePlayCommand(userId, content, nextMusic);
        };
        this.addSongsToServerQueue = async (songs, nextMusic) => {
            this.serverManager.enqueueSongs(this.server.serverId, songs, nextMusic);
            // Ver a possibilidade de implementar o design pattern observer para retornar mensagens
            const responseMessage = songs.length > 1 ? 'As músicas foram adicionadas a fila!' : `${songs[0].title} foi adicionado a fila!`;
            this.server.textChannel.send(responseMessage);
        };
        this.playWithCustomVolume = (songList, volume) => {
            return songList.map((song) => ({
                title: song.title,
                url: song.url,
                volume: volume_1.default.getVolume(volume),
            }));
        };
        this.serverManager = server_manager_1.default.getInstance();
        this.server = this.serverManager.get(serverId);
    }
}
exports.default = Play;
