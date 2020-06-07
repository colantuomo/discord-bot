import Discord from 'discord.js';
import Play from './app-methods/play';
import Playlist from './app-methods/playList';
import Shared from './shared/shared';
import Skip from './app-methods/skip';
import Stop from './app-methods/stop';
import Search from './app-methods/search';
import Favorites from './app-methods/favorites';
import Formatter from './formatter/formatter';
import QueueService from '../service/queue.service';
import environment from '../infra/environment';
import db from '../db/db';
import { DiscordEvents } from './app-methods/enums';

const ready = () => { };
const disconnect = () => { };
const reconnecting = () => { };

const main = async () => {
    console.log('\nBOM DIA MARCELO, INICIOU APLICAÇÃO');
    const client = new Discord.Client();

    await db.init();
    let favMap = await Favorites.getFavoritesMap();

    client.login(environment.token);
    client.once(DiscordEvents.READY, ready);
    client.once(DiscordEvents.RECONNECTING, reconnecting);
    client.once(DiscordEvents.DISCONNECT, disconnect);


    client.on(DiscordEvents.MESSAGE, async message => {
        if (message.author.bot) return;
        if (!message.content.startsWith(environment.prefix)) return;
        let serverQueue = QueueService.get(message.guild.id);

        if (Shared.command(message, 'play')) {
            Play.isLink(message.content) ? Play.execute(message, serverQueue, false) : handleCommand(message, favMap, serverQueue);
            return;
        } else if (Shared.command(message, 'first')) {
            Play.isLink(message.content) ? Play.execute(message, serverQueue, true) : handleCommand(message, favMap, serverQueue);
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
        } else if (Shared.command(message, 'favlist')) {
            const favList = await Favorites.getFavoriteCommands();
            message.channel.send(favList);
        } else if (Shared.command(message, 'fav')) {
            const newFav = await Favorites.addFav(message.content);
            if (newFav.created) {
                favMap = Favorites.refreshFavMap(favMap, message.content);
                message.channel.send(`Sucesso ao vincular link ao comando ${environment.prefix}${newFav.command}`);
            }
            //Comando resposta a uma pesquisa
        } else if (parseInt(message.content.replace(environment.prefix, ""))) {
            if (!(message.author.id in Search.getSearchSession())) {
                message.channel.send('You have to search for something before choose an item from the list.');
            } else {
                const nextMusic = Search.getLastCommandById(message.author.id) == 'first';
                Play.playSearch(message, serverQueue, nextMusic);
            }
            //Executando um comando personalizado
        } else if (Shared.commandIn(message.content, favMap)) {
            const key = message.content.replace(environment.prefix, '');
            message.content = `play ${favMap[key].link}`;

            favMap[key].playlist ?
                Playlist.addPlaylist(message) :
                Play.execute(message, serverQueue, false);
            //Comando invalido
        } else {
            message.channel.send('You need to enter a valid command!');
        }
    });
}

const handleCommand = (message: any, favMap: any, serverQueue: any) => {
    const command = message.content.substring(message.content.indexOf(' ') + 1);

    if (Shared.commandIn(command, favMap)) {
        message.content = `play ${favMap[command].link}`;
        Play.execute(message, serverQueue, true);
    } else {
        Search.search(message);
    }
}


main();