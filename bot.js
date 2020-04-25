const Discord = require('discord.js');
const { prefix } = require('./config.json');
const api = require('./api.js');
const ytdl = require('ytdl-core');
require('dotenv').config();
const client = new Discord.Client();
const queue = new Map();
searchSession = {};

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
    } else if (command(message, 'list')) {
        addPlaylist(message);
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
    } else if (parseInt(message.content.replace(`${prefix}`, ""))) {
        if (!(message.author.id in searchSession)) {
            message.channel.send('You have to search for something before choose an item from the list.');
        } else {
            playSearch(message, serverQueue);
        }
    }
    else {
        message.channel.send('You need to enter a valid command!');
    }
});

function formatQueue(serverQueue) {
    let queue = '```';
    serverQueue.songs.forEach((song, idx) => {
        queue += `${idx + 1} - ${song.title}\r\n`;
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
    if (!voiceChannel) return message.channel.send('Oh cabeção! você precisa estar em um canal de voz pra ouvir musica, né?!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('O Jovem! Eu preciso de permissões de falar e conectar!');
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
            message.channel.send('Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ', JSON.stringify(err));
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} foi adicionado a fila!`);
    }

}

async function addPlaylist(message){
    const args = message.content.split(' ');
    const voiceChannel = message.member.voiceChannel;
    //pega a penas a url do youtube e manda para o metodo getPlaylistData para pegar a lista de musicas
    const playlistData = await getPlaylistData(args[1], "");
    const numberPages = (playlistData.pageInfo.totalResults/playlistData.pageInfo.resultsPerPage);
    for (let page=1; page<=numberPages; page++) {
        const newPage = await getPlaylistData(args[1], playlistData.nextPageToken)
        playlistData.items.push(...newPage.items);
    }
    songsList = []
    // Faz um for na lista de musicas para pegar o nome e url do video
    for(let item of playlistData.items){
        serverQueue = queue.get(message.guild.id);
        const linkYoutube = 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId + '&list=' + item.snippet.playlistId;
        const song = {
            title: item.snippet.title,
            url: linkYoutube,
        };
        songsList.push(song);
    }
    // Constroi o obj para adicionar na fila do markin
    // Todo o processo daqui para baixo pode ser separado em outros metodos,
    // pois esse codigo esta sendo repetido no metodo 'execute', mas foi colocado aqui direto para testar playlist
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: songsList,
        volume: 5,
        playing: true,
    };

    queue.set(message.guild.id, queueContruct);
    try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
    } catch (err) {
        message.channel.send('I encountered a problem connecting to the voice channel ', JSON.stringify(err));
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }
}

async function search(message) {
    const idResponse = await getIds(formatMessage(message.content));

    if (idResponse.status == 403) {
        console.log('Limite diário de requisições atingidas (/SEARCH)');
        return;
    }

    const idList = idResponse.data.items.map(video => {
        return video.id.videoId;
    });

    const videoResponse = await getDetailsByIdList(idList);

    if (videoResponse.status == 403) {
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

async function getPlaylistData(url, nextPageToken="") {
    const result = await api.getPlaylist(url, nextPageToken);
    if (result) {
        return result.data
    } else {
        serverQueue.textChannel.send('Erro ao baixar playlist do Youtube');
    }
}

function showOptions(message, videosList){
    let msg = '';
    new Promise(resolve => {
        let userId = message.author.id;

        videosList.data.items.forEach((video, i) => {
            let title = video.snippet.title;
            let channelTitle = video.snippet.channelTitle;
            let duration = formatDuration(video.contentDetails.duration);
            let index = i + 1;
            msg += `${index}. ${title} | ${channelTitle} (${duration})\r\n`;
            //Recriando objeto sempre que o usuário fizer uma nova busca
            if (index == 1)
                searchSession[userId] = {};
            searchSession[userId][index] = video.id;
        });
        return resolve(msg);
    }).then(
        res => {
            message.channel.send("```" + res + "```");
        }, error => {
            message.channel.send('Erro ao exibir lista de vídeos encontrados.');
            console.log('showOptions', error);
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
    serverQueue.textChannel.send('Bye bye! :)');
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {'highWaterMark ': 64000 });
    const dispatcher = serverQueue.connection.playStream(stream);
    dispatcher.on('end', () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    }).on('error', error => {
        console.error(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

function playSearch(message, serverQueue) {
    let userId = message.author.id;
    let msg = message.content.replace(`${prefix}`, "");
    if (parseInt(msg) > 5 || parseInt(msg) < 1) {
        message.channel.send("This number isn't on the list.");
    } else {
        let videoId = searchSession[userId][msg];
        message.content = `${prefix}play https://www.youtube.com/watch?v=${videoId}`;
        execute(message, serverQueue);
    }
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
        return msg.replace(";play ", "");
    }
    return msg;
}

function formatDuration(duration) {
    if (duration) {
        var total = duration.replace(/PT|S/gi, "");
        var hasHour = total.indexOf("H") != -1;
        var base = total.split("H");
        var rest = hasHour ? base[1].split("M") : total.split("M");
        var minSec = formatDecimal(rest[0]) + ':' + formatDecimal(rest[1]);
        return hasHour ? formatDecimal(base[0]) + ':' + minSec : minSec;
    }
    return duration;
}

function formatDecimal(string) {
    if (string) {
        return string.length == 1 ? "0" + string : string;
    }
    return string;
}

client.login(process.env.TOKEN);
