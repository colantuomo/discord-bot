"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_manager_1 = __importDefault(require("./server-manager"));
class Skip {
    constructor() {
        this.skip = (message) => {
            var _a;
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
                message.channel.send('You have to be in a voice channel to stop the music!');
                return;
            }
            if (!this.queueService) {
                message.channel.send('There is no song that I could skip!');
                return;
            }
            const guildId = message.guild.id;
            const queue = this.queueService.get(guildId);
            queue === null || queue === void 0 ? void 0 : queue.connection.dispatcher.end();
        };
        this.queueService = server_manager_1.default.getInstance();
    }
}
exports.default = Skip;
