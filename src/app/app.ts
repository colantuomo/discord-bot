import Discord from 'discord.js';
import Play from './app-methods/play';
import Playlist from './app-methods/playList';
import Shared from './shared/shared';
import Skip from './app-methods/skip';
import Stop from './app-methods/stop';
import Search from './app-methods/search';
import Formatter from './formatter/formatter';
import QueueService from '../service/queue.service';
import environment from '../infra/environment';

console.log('INICIOU APLICAÇÃO')
const client = new Discord.Client();
// const queue = new Map();

client.once('ready', () => {
    console.log('Bot Connected');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.login(environment.token);

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(environment.prefix)) return;
    let serverQueue = QueueService.get(message.guild.id);

    if (Shared.command(message, 'play')) {
        Play.isLink(message.content) ? Play.execute(message, serverQueue, false) : Search.search(message);
        return;
    } else if (Shared.command(message, 'first')) {
        Play.isLink(message.content) ? Play.execute(message, serverQueue, true) : message.channel.send('NUM VAI DA! Atualmente este comando funciona apenas via link do YouTube.');
        return;
    } else if (Shared.command(message, 'list')) {
        Playlist.addPlaylist(message);
        return;
    } else if (Shared.command(message, 'skip')) {
        Skip.skip(message, serverQueue);
        return;
    } else if (Shared.command(message, 'stop')) {
        Stop.stop(message, serverQueue);
        return;
    } else if (Shared.command(message, 'leave')) {
        serverQueue.voiceChannel.leave();
    } else if (Shared.command(message, 'queue')) {
        let queue = Formatter.formatQueue(serverQueue);
        message.channel.send(queue);
    } else if (parseInt(message.content.replace(environment.prefix, ""))) {
        if (!(message.author.id in Search.getSearchSession())) {
            message.channel.send('You have to search for something before choose an item from the list.');
        } else {
            Play.playSearch(message, serverQueue);
        }
    }
    else {
        message.channel.send('You need to enter a valid command!');
    }
});