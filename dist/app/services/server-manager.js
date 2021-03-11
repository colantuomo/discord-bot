"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_1 = __importDefault(require("../shared/custom-error"));
const server_manager_utils_1 = __importDefault(require("../utils/server-manager.utils"));
const favorites_1 = __importDefault(require("../services/favorites"));
class ServerManager {
    constructor() {
        this.get = (serverId) => {
            return this.servers.get(serverId);
        };
        this.connect = async (serverId, textChannel, voiceChannel) => {
            const connection = await voiceChannel.join();
            const server = {
                serverId: serverId,
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                connection: connection,
                songs: [],
                playing: false,
                searchSession: {},
                favorites: {},
            };
            this.servers.set(serverId, server);
            return this.servers.get(serverId);
        };
        this.disconnect = (serverId) => {
            const server = this.servers.get(serverId);
            if (server) {
                this.servers.delete(serverId);
                const connection = server === null || server === void 0 ? void 0 : server.connection;
                if (connection)
                    server.voiceChannel.leave();
            }
        };
        this.enqueueSongs = (serverId, songList, nextMusic) => {
            this.servers.get(serverId).playing = true;
            nextMusic ? this.servers.get(serverId).songs.splice(1, 0, ...songList) : this.servers.get(serverId).songs.push(...songList);
        };
        this.startNewServer = async (message) => {
            try {
                server_manager_utils_1.default.validateServerConf(message);
                const serverId = message.guild.id;
                const textChannel = message.channel;
                const voiceChannel = message.member.voice.channel;
                const server = await this.connect(serverId, textChannel, voiceChannel);
                const favorites = new favorites_1.default(serverId);
                const favoriteObject = await favorites.getFavoritesMap();
                server.favorites = favoriteObject;
                return server;
            }
            catch (err) {
                if (err.type === 'Custom')
                    throw err;
                console.log('== startNewServer Error: ', err);
                throw new custom_error_1.default("Ih raaapaz! Encontrei um problema ao entrar no canal de voz. ", "Execution Error");
            }
        };
        this.servers = new Map();
    }
    static getInstance() {
        if (!ServerManager.instance) {
            ServerManager.instance = new ServerManager();
        }
        return ServerManager.instance;
    }
}
exports.default = ServerManager;
