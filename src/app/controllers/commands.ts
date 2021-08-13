import Discord from 'discord.js'
import Play from '../services/play'
import { environment } from '../../infra/environment'
import { ValidCommands } from '../models/commands.model'
import Queue from '../services/queue'
import ServerManager from '../services/server-manager'
import { Server } from '../models/server-manager.model'
import Favorites from '../services/favorites';
import { FavoritesInfo } from '../models/favorites.model'
import CommandsDAO from '../dao/commands.dao';

class Commands {
    private prefix = environment.prefix;
    private queue: Queue;
    private serverManager: ServerManager;
    private server: Server | undefined;
    private serverId: string
    private commands: Readonly<ValidCommands> = {
        fav: async (message: Discord.Message): Promise<void> => {
            const content: string = message.content.replace('fav', '').trim();
            const favorite = new Favorites(this.serverId);

            await favorite.addFavorite(content);

            const newFavorite = favorite.getKey(content);
            this.server!.textChannel.send(`Sucesso ao vincular link ao comando ${environment.prefix}${newFavorite}`);

            favorite.refreshFavMap(content);
        },
        favlist: (): void => {
            const favorite = new Favorites(this.serverId);
            favorite.showFavoriteCommands();
        },
        first: async (message: Discord.Message): Promise<void> => {
            const content: string = message.content.replace('first', '').trim();
            const userId: string = message.author.id;
            const play = new Play(this.serverId);
            const isCustomCommand = this.commandIn(content);

            isCustomCommand ? (async () => {
                const favorite: FavoritesInfo = this.server!.favorites[content];
                const favoriteLink: string = favorite.link;
                const volume: string = favorite.volume;

                await play.handlePlayCommand(userId, favoriteLink, true, volume);
            })() :
                await play.handlePlayCommand(userId, content, true);
        },
        help: async (): Promise<void> => {
            await this.showDefaultCommands();
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
        sync: async (): Promise<void> => {
            this.showSyncLink();
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

        if (!this.server)
            this.server = await this.serverManager.startNewServer(message);

        // Choosing an item from the search list
        if (parseInt(command)) {
            const userId: string = message.author.id;

            if (this.unavailableOptions(userId)) {
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
            const play: Play = new Play(this.serverId);
            const userId: string = message.author.id;
            const favorite: FavoritesInfo = this.server.favorites[command];
            const content: string = favorite.link;
            const volume: string = favorite.volume;

            await play.handlePlayCommand(userId, content, false, volume);
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

    private commandIn = (command: string): boolean => {
        const customCommands = this.server!.favorites;
        return command in customCommands;
    }

    private unavailableOptions = (userId: string): boolean => {
        const neverSearched = !(userId in this.server!.searchSession);
        const hasOptions = this.server!.searchSession[userId].options;

        return neverSearched || !hasOptions;
    }

    private showDefaultCommands = async (): Promise<void> => {
        const commands = await CommandsDAO.getDefaultCommands();
        let defaultCommands = '```';

        commands.forEach((item: any) => {
            defaultCommands += `${item.command} - ${item.desc} \r\n`;
        });

        defaultCommands += '```';
        this.server!.textChannel.send(defaultCommands);
    }

    private showSyncLink = (): void => {
        const sync = process.env.SYNC;
        const message = sync ? `Gere seu Daniel com moderação!\n${sync}` : 'Link do sync não configurado';

        this.server!.textChannel.send(message);
    }
}

export default Commands;
