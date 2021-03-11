"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_manager_1 = __importDefault(require("../services/server-manager"));
class QueueUtils {
    constructor() {
        this.validMember = (message) => {
            var _a;
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
                message.channel.send('You have to be in a voice channel to stop the music!');
                return false;
            }
            return true;
        };
        this.validQueue = (message) => {
            const serverId = message.guild.id;
            const server = this.serverMap.get(serverId);
            if (!server || server.songs.length === 0) {
                message.channel.send('There is no music playing.');
                return false;
            }
            return true;
        };
        this.serverMap = server_manager_1.default.getInstance();
    }
    getVolume(volumeIndex) {
        const volumeDict = {
            '1': 0.01,
            '2': 0.02,
            '3': 0.03,
            '4': 0.04,
            '5': 0.05,
            '6': 0.10,
            '7': 0.20,
            '8': 0.30,
            '9': 0.40,
            '10': 0.50,
            '11': 0.60,
            '12': 0.70,
            '13': 0.80,
            '14': 0.90,
            '15': 1.00,
        };
        return volumeDict[volumeIndex];
    }
}
exports.default = QueueUtils;
