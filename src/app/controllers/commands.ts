import Discord from 'discord.js'
import Play from '../services/play'
import { environment } from '../../infra/environment'
// import db from '../db/db'
import ValidCommands from '../models/commands.model'
import Queue from '../services/queue'
import ServerManager from '../services/server-manager'
import { Server } from '../models/server-manager.model'

class Commands {
    private prefix = environment.prefix;
    private queue: Queue;
    private serverManager: ServerManager;
    private server: Server | undefined;
    private serverId: string
    private commands: Readonly<ValidCommands> = {
        fav: (): void => {

        },
        favlist: (): void => {

        },
        first: async (message: Discord.Message): Promise<void> => {
            const content: string = message.content.replace('first', '').trim();
            const userId: string = message.author.id;

            if (!this.server)
                await this.serverManager.startNewServer(message);

            const play = new Play(this.serverId);
            play.handlePlayCommand(userId, content, true);
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
                const play = new Play(this.serverId);
                const paused = play.pause();
                message.channel.send(`Música ${paused ? 'pausada' : 'retomada'}.`);
            }
            catch (err) {
                const errormessage = err.type && err.type === 'Custom' ? err.message : 'Erro ao pausar música.';
                message.channel.send(errormessage);
            }

        },
        play: async (message: Discord.Message): Promise<void> => {
            const content: string = message.content.replace('play', '').trim();

            if (!this.server)
                await this.serverManager.startNewServer(message);

            const play = new Play(this.serverId);

            if (content === '') {
                play.pause();
                return;
            }

            const userId: string = message.author.id;
            await play.handlePlayCommand(userId, content, false);
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
        },
    }

    constructor(serverId: string) {
        this.serverId = serverId;
        this.queue = new Queue();
        this.serverManager = ServerManager.getInstance();
        this.server = this.serverManager.get(serverId);
    }

    handleCommands = async (message: Discord.Message): Promise<void> => {
        const args: Array<string> = message.content.split(' ');
        const command: string = args[0].toLowerCase();

        // Choosing an item from the search list
        if (parseInt(command)) {
            const userId: string = message.author.id;

            if (!this.server || this.unavailableOptions(userId)) {
                const msg = 'You have to search for something before choose an item from the list.';
                message.channel.send(msg);
                return;
            }

            const play = new Play(this.serverId);
            await play.playSearch(userId, parseInt(command));
            return;
        }

        // Custom command
        if (this.commandIn(command)) {
            //     const key = message.content.replace(environment.prefix, '')
            //     message.content = `play ${favMap[key].link}`

            //     favMap[key].playlist
            //         ? Playlist.addPlaylist(message)
            //         : Play.play(message, serverQueue, false)
            return;
        }

        // Default commands
        const executeCommand = this.commands[command as keyof ValidCommands];
        if (executeCommand)
            await executeCommand(message);
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

    private unavailableOptions = (userId: string): boolean => {
        const neverSearched = !(userId in this.server!.searchSession);
        const hasOptions = this.server!.searchSession[userId].options;
        console.log('hasOptions: ', hasOptions);


        return neverSearched || !hasOptions;
    }
}

export default Commands;
