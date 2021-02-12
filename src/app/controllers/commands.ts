import Discord from 'discord.js'
import Play from '../services/play'
import Playlist from '../services/playList'
import Skip from '../services/skip'
import Stop from '../services/stop'
import Search from '../services/search'
import Favorites from '../services/favorites'
import Help from '../services/help'
import Volume from '../services/volume'
// import Formatter from './formatter/formatter'
import QueueService from '../services/server-manager'
import { environment } from '../../infra/environment'
// import db from '../db/db'
import ValidCommands from '../models/commands.model'
import Queue from '../services/queue'
import ServerManager from '../services/server-manager'

class Commands {
    private prefix = environment.prefix;
    private play: Play;
    private queue: Queue;
    private search: Search;
    private serverManager: ServerManager;
    private serverId: string
    private commands: Readonly<ValidCommands> = {
        fav: (): void => {

        },
        favlist: (): void => {

        },
        first: (message: Discord.Message): void => {
            const content: string = message.content.replace('first', '').trim();
            message.content = content;

            this.play.handlePlayCommand(message, true);
        },
        help: (): void => {

        },
        leave: (): void => {
            if (this.serverId)
                this.serverManager.disconnect(this.serverId);
        },
        pause: (message: Discord.Message): void => {
            if (!this.queue.validQueueParams(message))
                return;

            try {
                const paused = this.play.pause();
                message.channel.send(`Música ${paused ? 'pausada' : 'retomada'}.`);
            }
            catch (err) {
                const errormessage = err.type && err.type === 'Custom' ? err.message : 'Erro ao pausar música.';
                message.channel.send(errormessage);
            }

        },
        play: (message: Discord.Message): void => {
            const content: string = message.content.replace('play', '').trim();

            if (content === '') {
                this.play.pause();
                return;
            }

            message.content = content;

            this.play.handlePlayCommand(message, false);

            // this.play.isLink(content)
            //     ? this.play.play(message, false)
            //     : this.handlePlayCommand(message)
        },
        queue: (message: Discord.Message): void => {
            if (!this.queue.validQueueParams(message))
                return;

            this.queue.songs(this.serverId);
        },
        skip: (message: Discord.Message): void => {
            if (!this.queue.validQueueParams(message))
                return;

            this.queue.skip(this.serverId);
        },
        stop: (message: Discord.Message): void => {
            if (!this.queue.validQueueParams(message))
                return;

            this.queue.stop(this.serverId);
        },
        volume: (message: Discord.Message): void => {
            if (!this.queue.validQueueParams(message))
                return;

            const volume: string = message.content.replace('volume', '').trim();
            this.queue.setVolume(this.serverId, volume);
            // serverQueue.connection.dispatcher.setVolume(Volume.getVolume(volume));
        },
    }

    constructor(serverId: string) {
        this.serverId = serverId;
        this.play = new Play(serverId);
        this.queue = new Queue();
        this.serverManager = ServerManager.getInstance();
        this.search = new Search();
    }

    handleCommands = (message: Discord.Message) => {
        const args: Array<string> = message.content.split(' ');
        const command: string = args[0].toLowerCase();

        // Choosing an item from the search list
        if (parseInt(command)) {
            if (!(message.author.id in this.search.getSearchSession())) {
                message.channel.send(
                    'You have to search for something before choose an item from the list.'
                )
                return;
            }

            const nextMusic = this.search.getLastCommandById(message.author.id) == 'first'
            // this.play.playSearch(message, nextMusic)
        }

        // Custom command
        if (this.commandIn(command)) {
            //     const key = message.content.replace(environment.prefix, '')
            //     message.content = `play ${favMap[key].link}`

            //     favMap[key].playlist
            //         ? Playlist.addPlaylist(message)
            //         : Play.play(message, serverQueue, false)
        }

        // Default commands
        const executeCommand = this.commands[command as keyof ValidCommands];
        if (executeCommand)
            executeCommand(message);
        else {
            message.channel.send(
                `Comando inválido. Caso esteja com dúvida de como utilizar os comandos do bot digite ${this.prefix}help`
            )
        }

    }

    private commandIn = (message: any): boolean => {
        const map = {}; // *********
        const command = message.replace(environment.prefix, '');
        return command in map;
    }
}

export default Commands;
