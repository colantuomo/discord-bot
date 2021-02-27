"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
// @ts-ignore
const playList_1 = require("./app-methods/playList");
const play_1 = __importDefault(require("./app-methods/play"));
const skip_1 = __importDefault(require("./app-methods/skip"));
const stop_1 = __importDefault(require("./app-methods/stop"));
const search_1 = __importDefault(require("./app-methods/search"));
const favorites_1 = __importDefault(require("./app-methods/favorites"));
const help_1 = __importDefault(require("./app-methods/help"));
const volume_1 = __importDefault(require("./app-methods/volume"));
const formatter_1 = __importDefault(require("./formatter/formatter"));
const queue_service_1 = __importDefault(require("../service/queue.service"));
const shared_1 = __importDefault(require("./shared/shared"));
const environment_1 = __importDefault(require("../infra/environment"));
const db_1 = __importDefault(require("../db/db"));
const main = async () => {
    var _a;
    console.log('\nBOM DIA MARCELO, INICIOU APLICAÇÃO');
    const client = new discord_js_1.default.Client();
    const queueService = queue_service_1.default.getInstance();
    (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.setPresence({ status: 'dnd' });
    await db_1.default.init();
    let favMap = await favorites_1.default.getFavoritesMap();
    client.once('ready', () => {
        var _a;
        console.log('\nBot Connected');
        (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.setPresence({ status: 'online' });
    });
    client.once('reconnecting', () => {
        console.log('Reconnecting!');
    });
    client.once('disconnect', () => {
        console.log('Disconnect!');
    });
    client.login(environment_1.default.token);
    client.on('message', async (message) => {
        var _a;
        if (message.author.bot)
            return;
        if (!message.content.startsWith(environment_1.default.prefix))
            return;
        const serverQueue = queueService.get((_a = message === null || message === void 0 ? void 0 : message.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (shared_1.default.command(message, 'play')) {
            play_1.default.isLink(message.content)
                ? play_1.default.execute(message, serverQueue, false)
                : handleCommand(message, favMap, serverQueue);
        }
        else if (shared_1.default.command(message, 'first')) {
            play_1.default.isLink(message.content)
                ? play_1.default.execute(message, serverQueue, true)
                : handleCommand(message, favMap, serverQueue);
        }
        else if (shared_1.default.command(message, 'list')) {
            playList_1.playlist.addPlaylist(message);
        }
        else if (shared_1.default.command(message, 'skip')) {
            skip_1.default.skip(message, serverQueue);
        }
        else if (shared_1.default.command(message, 'volume')) {
            const msg = message.content.split(' ');
            const volume = msg.length > 1 ? msg[1].toString() : '5';
            serverQueue.connection.dispatcher.setVolume(volume_1.default.getVolume(volume));
        }
        else if (shared_1.default.command(message, 'stop')) {
            stop_1.default.stop(message, serverQueue);
        }
        else if (shared_1.default.command(message, 'leave')) {
            serverQueue.voice.channel.leave();
        }
        else if (shared_1.default.command(message, 'queue')) {
            let queue = formatter_1.default.formatQueue(serverQueue);
            message.channel.send(queue);
        }
        else if (shared_1.default.command(message, 'favlist')) {
            const favList = await favorites_1.default.getFavoriteCommands();
            message.channel.send(favList);
        }
        else if (shared_1.default.command(message, 'fav')) {
            const newFav = await favorites_1.default.addFav(message.content);
            if (newFav.created) {
                favMap = favorites_1.default.refreshFavMap(favMap, message.content);
                message.channel.send(`Sucesso ao vincular link ao comando ${environment_1.default.prefix}${newFav.command}`);
            }
            //Comando resposta a uma pesquisa
        }
        else if (parseInt(message.content.replace(environment_1.default.prefix, ''))) {
            if (!(message.author.id in search_1.default.getSearchSession())) {
                message.channel.send('You have to search for something before choose an item from the list.');
            }
            else {
                const nextMusic = search_1.default.getLastCommandById(message.author.id) == 'first';
                play_1.default.playSearch(message, serverQueue, nextMusic);
            }
            //Executando um comando personalizado
        }
        else if (shared_1.default.commandIn(message.content, favMap)) {
            const key = message.content.replace(environment_1.default.prefix, '');
            message.content = `play ${favMap[key].link}`;
            favMap[key].playlist
                ? playList_1.playlist.addPlaylist(message)
                : play_1.default.execute(message, serverQueue, false);
            //Helper para listar os comandos
        }
        else if (shared_1.default.command(message, 'help')) {
            let commands = await help_1.default.formattedCommands();
            message.channel.send(commands);
        }
        else {
            message.channel.send(`Comando inválido. Caso esteja com dúvida de como utilizar os comandos do bot digite ${environment_1.default.prefix}help`);
        }
    });
};
const handleCommand = (message, favMap, serverQueue) => {
    const command = message.content.substring(message.content.indexOf(' ') + 1);
    if (shared_1.default.commandIn(command, favMap)) {
        message.content = `play ${favMap[command].link}`;
        play_1.default.execute(message, serverQueue, true);
    }
    else {
        search_1.default.search(message);
    }
};
main();
