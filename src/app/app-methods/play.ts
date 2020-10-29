import ytdl from 'ytdl-core';
import QueueService from '../../service/queue.service';
import Search from './search';
import environment from '../../infra/environment';
import QueueContructModel from '../../model/queue-contruct.model';
import { BroadcastDispatcher } from 'discord.js';

class Play {
    isLink(content: string) {
        const arg = content.split(' ')[1];
        return arg && arg.includes('http');
    }

    async execute(message: any, serverQueue: any, nextMusic: Boolean) {
        console.log('message.content', message.content)
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
        console.log("ARGS 1", args[1])
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
        console.log('SONG', song)
        if (!serverQueue) {
            const queueContruct: QueueContructModel = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 0.05,
                playing: true,
            };
            QueueService.set(message.guild.id, queueContruct);
            queueContruct.songs.push(song);
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(message.guild, queueContruct.songs[0]);
            } catch (err) {
                message.channel.send('Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ', JSON.stringify(err));
                QueueService.queue.delete(message.guild.id);
            }
        } else {
            nextMusic ? serverQueue.songs.splice(1, 0, song) : serverQueue.songs.push(song);
            message.channel.send(`${song.title} foi adicionado a fila!`);
        }
    }

    play(guild: any, song: any) {
        const serverQueue = QueueService.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            QueueService.delete(guild.id);
            return;
        }
        const streamOptions: ytdl.downloadOptions = {
            quality: 'highestaudio',
            filter: 'audioonly',
            highWaterMark: 1 << 25,
        }
        const stream = ytdl(song.url, streamOptions);
        const dispatcher: BroadcastDispatcher = serverQueue.connection.play(stream);
        dispatcher.setVolume(serverQueue.volume);
        dispatcher.on('finish', () => {
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
        }).on('error', (error: any) => {
            console.error('== play error: ', error);
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
        });
    }

    playSearch(message: any, serverQueue: any, nextMusic: Boolean) {
        let userId = message.author.id;
        let msg = message.content.replace(environment.prefix, "");
        if (parseInt(msg) > 5 || parseInt(msg) < 1) {
            message.channel.send("This number isn't on the list.");
        } else {
            const searchSession = Search.getSearchSession();
            let videoId = searchSession[userId][msg];
            message.content = environment.prefix + 'play ' + 'https://www.youtube.com/watch?v=' + videoId;
            console.log('message content', message.content)
            this.execute(message, serverQueue, nextMusic);
        }
    }
}

const instance = new Play();
export = instance;