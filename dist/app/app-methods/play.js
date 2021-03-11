"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const queue_service_1 = __importDefault(require("../../service/queue.service"));
const search_1 = __importDefault(require("./search"));
const environment_1 = __importDefault(require("../../infra/environment"));
class Play {
    constructor() {
        this.queueService = queue_service_1.default.getInstance();
    }
    isLink(content) {
        const arg = content.split(' ')[1];
        return arg && arg.includes('http');
    }
    async execute(message, serverQueue, nextMusic) {
        const args = message.content.split(' ');
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send('Oh cabeção! você precisa estar em um canal de voz pra ouvir musica, né?!');
            return;
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            message.channel.send('O Jovem! Eu preciso de permissões de falar e conectar!');
            return;
        }
        const url = args.length > 0 ? args[1] : '';
        console.log("==== URL: ", url);
        const songInfo = await ytdl_core_1.default.getBasicInfo(url.toString()).catch((error) => {
            console.log('== ERROR YTDL: ', error);
        });
        if (!songInfo) {
            message.channel.send('Deu aquele erro la men');
            return;
        }
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
        console.log('SONG', song);
        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 0.05,
                playing: true,
            };
            this.queueService.set(message.guild.id, queueContruct);
            queueContruct.songs.push(song);
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(message.guild, queueContruct.songs[0]);
            }
            catch (err) {
                message.channel.send('Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ', JSON.stringify(err));
                this.queueService.queue.delete(message.guild.id);
            }
        }
        else {
            nextMusic ? serverQueue.songs.splice(1, 0, song) : serverQueue.songs.push(song);
            message.channel.send(`${song.title} foi adicionado a fila!`);
        }
    }
    play(guild, song) {
        const serverQueue = this.queueService.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queueService.delete(guild.id);
            return;
        }
        const streamOptions = {
            quality: 'highestaudio',
            filter: 'audioonly',
            highWaterMark: 1 << 25,
        };
        const stream = ytdl_core_1.default(song.url, streamOptions);
        const dispatcher = serverQueue.connection.play(stream);
        dispatcher.setVolume(serverQueue.volume);
        dispatcher.on('finish', () => {
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
        }).on('error', (error) => {
            console.error('== play error: ', error);
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
        });
    }
    playSearch(message, serverQueue, nextMusic) {
        let userId = message.author.id;
        let msg = message.content.replace(environment_1.default.prefix, "");
        if (parseInt(msg) > 5 || parseInt(msg) < 1) {
            message.channel.send("This number isn't on the list.");
        }
        else {
            const searchSession = search_1.default.getSearchSession();
            let videoId = searchSession[userId][msg];
            message.content = environment_1.default.prefix + 'play ' + 'https://www.youtube.com/watch?v=' + videoId;
            this.execute(message, serverQueue, nextMusic);
        }
    }
}
const instance = new Play();
module.exports = instance;
