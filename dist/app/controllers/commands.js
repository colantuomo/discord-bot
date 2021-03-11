"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const play_1 = __importDefault(require("../services/play"));
const environment_1 = require("../../infra/environment");
const queue_1 = __importDefault(require("../services/queue"));
const server_manager_1 = __importDefault(require("../services/server-manager"));
const favorites_1 = __importDefault(require("../services/favorites"));
const commands_dao_1 = __importDefault(require("../dao/commands.dao"));
class Commands {
    constructor(serverId) {
        this.prefix = environment_1.environment.prefix;
        this.commands = {
            fav: async (message) => {
                const content = message.content.replace('fav', '').trim();
                const favorite = new favorites_1.default(this.serverId);
                await favorite.addFavorite(content);
                const newFavorite = favorite.getKey(content);
                this.server.textChannel.send(`Sucesso ao vincular link ao comando ${environment_1.environment.prefix}${newFavorite}`);
                favorite.refreshFavMap(content);
            },
            favlist: () => {
                const favorite = new favorites_1.default(this.serverId);
                favorite.showFavoriteCommands();
            },
            first: async (message) => {
                const content = message.content.replace('first', '').trim();
                const userId = message.author.id;
                const play = new play_1.default(this.serverId);
                const isCustomCommand = this.commandIn(content);
                isCustomCommand ? (async () => {
                    const favorite = this.server.favorites[content];
                    const favoriteLink = favorite.link;
                    const volume = favorite.volume;
                    await play.handlePlayCommand(userId, favoriteLink, true, volume);
                })() :
                    await play.handlePlayCommand(userId, content, true);
            },
            help: async () => {
                await this.showDefaultCommands();
            },
            leave: () => {
                if (this.serverId)
                    this.serverManager.disconnect(this.serverId);
            },
            pause: (message) => {
                if (!this.queue.validQueueParams(message))
                    return;
                try {
                    const play = new play_1.default(this.serverId);
                    const paused = play.pause();
                    message.channel.send(`Música ${paused ? 'pausada' : 'retomada'}.`);
                }
                catch (err) {
                    const errormessage = err.type && err.type === 'Custom' ? err.message : 'Erro ao pausar música.';
                    message.channel.send(errormessage);
                }
            },
            play: async (message) => {
                const content = message.content.replace('play', '').trim();
                const play = new play_1.default(this.serverId);
                if (content === '') {
                    play.pause();
                    return;
                }
                const userId = message.author.id;
                await play.handlePlayCommand(userId, content, false);
            },
            queue: (message) => {
                if (!this.queue.validQueueParams(message))
                    return;
                this.queue.songs(this.serverId);
            },
            skip: (message) => {
                if (!this.queue.validQueueParams(message))
                    return;
                this.queue.skip(this.serverId);
            },
            stop: (message) => {
                if (!this.queue.validQueueParams(message))
                    return;
                this.queue.stop(this.serverId);
            },
            volume: (message) => {
                if (!this.queue.validQueueParams(message))
                    return;
                const volume = message.content.replace('volume', '').trim();
                this.queue.setVolume(this.serverId, volume);
            },
        };
        this.handleCommands = async (message) => {
            const args = message.content.split(' ');
            const command = args[0].toLowerCase();
            if (!this.server)
                this.server = await this.serverManager.startNewServer(message);
            // Choosing an item from the search list
            if (parseInt(command)) {
                const userId = message.author.id;
                if (this.unavailableOptions(userId)) {
                    const msg = 'You have to search for something before choose an item from the list.';
                    message.channel.send(msg);
                    return;
                }
                const play = new play_1.default(this.serverId);
                await play.playSearch(userId, parseInt(command));
                return;
            }
            // Custom command
            if (this.commandIn(command)) {
                const play = new play_1.default(this.serverId);
                const userId = message.author.id;
                const favorite = this.server.favorites[command];
                const content = favorite.link;
                const volume = favorite.volume;
                await play.handlePlayCommand(userId, content, false, volume);
                return;
            }
            // Default commands
            const executeCommand = this.commands[command];
            if (executeCommand)
                await executeCommand(message);
            else {
                message.channel.send(`Comando inválido. Caso esteja com dúvida de como utilizar os comandos do bot digite ${this.prefix}help`);
            }
        };
        this.commandIn = (command) => {
            const customCommands = this.server.favorites;
            return command in customCommands;
        };
        this.unavailableOptions = (userId) => {
            const neverSearched = !(userId in this.server.searchSession);
            const hasOptions = this.server.searchSession[userId].options;
            return neverSearched || !hasOptions;
        };
        this.showDefaultCommands = async () => {
            const commands = await commands_dao_1.default.getDefaultCommands();
            let defaultCommands = '```';
            commands.forEach((item) => {
                defaultCommands += `${item.command} - ${item.desc} \r\n`;
            });
            defaultCommands += '```';
            this.server.textChannel.send(defaultCommands);
        };
        this.serverId = serverId;
        this.queue = new queue_1.default();
        this.serverManager = server_manager_1.default.getInstance();
        this.server = this.serverManager.get(serverId);
    }
}
exports.default = Commands;
