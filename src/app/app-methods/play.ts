import ytdl from 'ytdl-core';
import QueueService from '../../service/queue.service';
import Search from './search';
import environment from '../../infra/environment';
import QueueContructModel from '../../model/queue-contruct.model';

class Play {
    isLink(content: string) {
        const arg = content.split(' ')[1];
        if (arg && arg.includes('http')) {
            return true;
        }
        return false;
    }

    async execute(message: any, serverQueue: any, nextMusic: boolean) {
        console.log(' message.content',  message.content)
        const args = message.content.split(' ');
    
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send('Oh cabeção! você precisa estar em um canal de voz pra ouvir musica, né?!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('O Jovem! Eu preciso de permissões de falar e conectar!');
        }
        console.log("ARGS 1", args[1])
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
        console.log('SONG', song)
        if (!serverQueue) {
            const queueContruct: QueueContructModel = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
    
            QueueService.set(message.guild.id, queueContruct);
            queueContruct.songs.push(song);
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;;
                this.play(message.guild, queueContruct.songs[0]);
            } catch (err) {
                message.channel.send('Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ', JSON.stringify(err));
                QueueService.queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            nextMusic ? serverQueue.songs.splice(1, 0, song) : serverQueue.songs.push(song);
            return message.channel.send(`${song.title} foi adicionado a fila!`);
        }
    }

    play(guild: any, song: any) {
        const serverQueue = QueueService.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            QueueService.delete(guild.id);
            return;
        }
        const stream = ytdl(song.url, {highWaterMark: 64000 });
        const dispatcher = serverQueue.connection.playStream(stream);
        dispatcher.on('end', () => {
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
        }).on('error', (error: any) => {
            console.error(error);
        });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }

    playSearch(message: any, serverQueue: any) {
        let userId = message.author.id;
        let msg = message.content.replace(environment.prefix, "");
        if (parseInt(msg) > 5 || parseInt(msg) < 1) {
            message.channel.send("This number isn't on the list.");
        } else {
            const searchSession = Search.getSearchSession();
            let videoId = searchSession[userId][msg];
            message.content = environment.prefix + 'play ' + 'https://www.youtube.com/watch?v=' + videoId;
            console.log('message content', message.content)
            this.execute(message, serverQueue, false);
        }
    }
}

const instance = new Play();
export = instance;