"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const favorites_schema_1 = __importDefault(require("../../schema/favorites.schema"));
const help_1 = __importDefault(require("../app-methods/help"));
class Favorites {
    async getFavoritesMap() {
        let result = {};
        const data = await favorites_schema_1.default.find();
        data.map((item) => (result[item.command] = {
            link: item.link,
            playlist: item.playlist
        }));
        return result;
    }
    async addFav(message) {
        try {
            const key = this.getKey(message);
            if (await this.keyAlreadyExists(key)) {
                throw 'Comando já utilizado para outra função.';
            }
            const value = this.getValue(message);
            const playlist = this.isPlaylist(value);
            await this.upsertFavorite(key, value, playlist);
            return { created: true, command: key };
        }
        catch (error) {
            console.log('== ERRO AO INSERIR NOVO FAVORITO == ', error);
            return { created: false, command: '' };
        }
    }
    getFormattedMessage(message) {
        const params = new RegExp('[^;fav].+').exec(message);
        return params ? params[0] : '';
    }
    getKey(message) {
        const msg = this.getFormattedMessage(message);
        return msg.split('http')[0].trim();
    }
    getValue(message) {
        const msg = this.getFormattedMessage(message);
        return msg.slice(msg.indexOf('http')).trim();
    }
    isPlaylist(message) {
        return message.includes('list=');
    }
    async keyAlreadyExists(key) {
        const allComannds = await help_1.default.getCommandsMap();
        return key in allComannds;
    }
    async upsertFavorite(command, link, playlist) {
        await favorites_schema_1.default.updateOne({ command }, { command, link, playlist }, { upsert: true });
    }
    refreshFavMap(favMap, message) {
        const key = this.getKey(message);
        const link = this.getValue(message);
        const playlist = this.isPlaylist(link);
        favMap[key] = { link, playlist };
        return favMap;
    }
    async getFavoriteCommands() {
        let result = '```';
        const data = await favorites_schema_1.default.find();
        data.forEach((item) => {
            result += `${item.command} - ${item.link} \r\n`;
        });
        result += '```';
        return result;
    }
}
const instance = new Favorites();
module.exports = instance;
