"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_manager_1 = __importDefault(require("./server-manager"));
const queue_utils_1 = __importDefault(require("../utils/queue.utils"));
class Queue {
    constructor() {
        this.skip = (serverId) => {
            const server = this.serverMap.get(serverId);
            this.finishStream(server);
        };
        this.stop = (serverId) => {
            const server = this.serverMap.get(serverId);
            server.textChannel.send('Bye bye! :)');
            server.songs = [];
            this.finishStream(server);
        };
        this.songs = (serverId) => {
            const server = this.serverMap.get(serverId);
            let resultMessage = '```autohotkey\r\n';
            if ((server === null || server === void 0 ? void 0 : server.songs.length) > 0) {
                server.songs.forEach((song, idx) => {
                    if (idx === 0) {
                        resultMessage += `
===============================================
TOCANDO AGORA: ${song.title}
===============================================
PRÓXIMAS NA FILA:
===============================================
`;
                    }
                    else {
                        resultMessage += `${idx < 10 ? '0' + idx : idx} - ${song.title}\r\n`;
                    }
                });
            }
            else {
                resultMessage += 'Nenhum item na fila';
            }
            resultMessage += '```';
            server.textChannel.send(resultMessage);
        };
        this.setVolume = (serverId, volume) => {
            const newVolume = this.utils.getVolume(volume);
            this.serverMap.get(serverId).connection.dispatcher.setVolume(newVolume);
        };
        this.validQueueParams = (message) => {
            return (this.utils.validMember(message) && this.utils.validQueue(message));
        };
        this.finishStream = (server) => {
            var _a, _b;
            (_b = (_a = server.connection) === null || _a === void 0 ? void 0 : _a.dispatcher) === null || _b === void 0 ? void 0 : _b.end();
        };
        this.serverMap = server_manager_1.default.getInstance();
        this.utils = new queue_utils_1.default();
    }
}
exports.default = Queue;
