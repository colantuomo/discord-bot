"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_dao_1 = __importDefault(require("../dao/commands.dao"));
const favorites_dao_1 = __importDefault(require("../dao/favorites.dao"));
const custom_error_1 = __importDefault(require("../shared/custom-error"));
const server_manager_1 = __importDefault(require("./server-manager"));
class Favorites {
    constructor(serverId) {
        this.addFavorite = async (message) => {
            const command = this.getKey(message);
            if (await this.keyAlreadyExists(command))
                throw new custom_error_1.default('Comando já utilizado para outra função.', 'Validation Error');
            const link = this.getValue(message);
            const isPlaylist = this.isPlaylist(link);
            await this.upsertFavorite(command, link, isPlaylist);
        };
        this.refreshFavMap = (message) => {
            const key = this.getKey(message);
            const link = this.getValue(message);
            const isPlaylist = this.isPlaylist(link);
            this.server.favorites[key] = {
                serverId: this.server.serverId,
                link,
                volume: '5',
                isPlaylist,
            };
        };
        this.showFavoriteCommands = () => {
            let favoriteCommands = '```';
            const favorites = this.server.favorites;
            for (const command in favorites)
                favoriteCommands += `${command} - ${favorites[command].link} \r\n`;
            favoriteCommands += '```';
            this.server.textChannel.send(favoriteCommands);
        };
        this.server = server_manager_1.default.getInstance().get(serverId);
    }
    async getFavoritesMap() {
        const result = {};
        const data = await favorites_dao_1.default.getFavoritesByServer(this.server.serverId);
        data.forEach((item) => result[item.command] = {
            link: item.link,
            isPlaylist: !!item.playlist,
            serverId: item.serverId,
            volume: item.volume
        });
        return result;
    }
    getKey(message) {
        const msg = this.getFormattedMessage(message);
        return msg.split('http')[0].trim();
    }
    getValue(message) {
        const msg = this.getFormattedMessage(message);
        return msg.slice(msg.indexOf('http')).trim();
    }
    getFormattedMessage(message) {
        const params = new RegExp('[^;fav].+').exec(message);
        return params ? params[0] : '';
    }
    isPlaylist(message) {
        return message.includes('list=');
    }
    async keyAlreadyExists(key) {
        const allComannds = await commands_dao_1.default.getDefaultCommands();
        return (allComannds.filter((item) => item.command === key)).length > 0;
    }
    async upsertFavorite(command, link, isPlaylist) {
        const filter = {
            serverId: this.server.serverId,
            command,
        };
        const update = {
            command,
            link,
            isPlaylist,
            volume: 5
        };
        await favorites_dao_1.default.upsertFavorite(filter, update);
    }
}
exports.default = Favorites;
