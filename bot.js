const Discord = require('discord.js');
const { prefix } = require('./config.json');
const api = require('./api.js');
const ytdl = require('ytdl-core');
require('dotenv').config();
const client = new Discord.Client();
const queue = new Map();

client.once('ready', () => {
    console.log('Bot Connected');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (command(message, 'play')) {
        if (isLink(message.content)) {
            execute(message, serverQueue);
        } else {
            search(message);
        }
        return;
    } else if (command(message, 'skip')) {
        skip(message, serverQueue);
        return;
    } else if (command(message, 'stop')) {
        stop(message, serverQueue);
        return;
    } else if (command(message, 'leave')) {
        serverQueue.voiceChannel.leave();
    } else if (command(message, 'queue')) {
        let queue = formatQueue(serverQueue);
        message.channel.send(queue);
    }
    else {
        message.channel.send('You need to enter a valid command!');
    }
});

function formatQueue(serverQueue) {
    let queue = '```';
    serverQueue.songs.forEach((song, idx) => {
        queue += `${idx + 1}. - ${song.title}`;
    })
    queue += '```';
    return queue;
}

function command(message, param) {
    return message.content.startsWith(`${prefix}${param}`);
}

async function execute(message, serverQueue) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            message.channel.send('I encountered a problem connecting to the voice channel ', JSON.stringify(err));
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }

}

async function search(message) {
    const idResponse = await getIds(formatMessage(message.content));

    if(idResponse.status == 403){
        console.log('Limite diário de requisições atingidas (/SEARCH)');
        return;
    }

    const idList = idResponse.data.items.map(video => {
        return video.id.videoId;
    });

    const videoResponse = await getDetailsByIdList(idList);

    if(videoResponse.status == 403){
        console.log('Limite diário de requisições atingidas (/VIDEOS)');
        return;
    }

    showOptions(message, videoResponse);
}

async function getIds(msg) {
    return await api.search(msg);
}

async function getDetailsByIdList(idList) {
    return await api.searchById(idList.join(","));
}

function showOptions(message, videosList){
    let msg = '';

    new Promise(resolve => {
        videosList.data.items.forEach( (video, index) => {
            let title = video.snippet.title;
            let channelTitle = video.snippet.channelTitle;
            let duration = video.contentDetails.duration;
            msg += `${index+1}. ${title} | ${channelTitle} (${duration})\r\n`;
        });
        return resolve(msg);
    })
    .then(
        msg => {
            message.channel.send("```"+msg+"```");
        }, error => {
            console.log('Erro ao exibir lista de vídeos encontrados.', error);
        }
    );
}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const dispatcher = serverQueue.connection.playStream(stream);
    dispatcher.on('end', () => {
        serverQueue.textChannel.send('Bye bye! :)');
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    }).on('error', error => {
        console.error(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

function isLink(content) {
    const arg = content.split(' ')[1];
    if (arg && arg.includes('http')) {
        return true;
    }
    return false;
}

function formatMessage(msg) {
    if (msg) {
        return msg.split(' ')[1];
    }
    return msg;
}

client.login(process.env.TOKEN);
