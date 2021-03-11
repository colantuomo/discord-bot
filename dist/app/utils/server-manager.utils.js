"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_1 = __importDefault(require("../shared/custom-error"));
class ServerManagerUtils {
    constructor() {
        this.validateServerConf = (message) => {
            var _a, _b;
            const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            if (!voiceChannel)
                throw new custom_error_1.default('Oh cabeção! você precisa estar em um canal de voz pra ouvir musica, né?!', 'Validation Error');
            const user = message.client.user;
            if (!user)
                throw new custom_error_1.default('Erro ao identificar usuário.', 'Validation Error');
            const permissions = voiceChannel.permissionsFor(user);
            if (!(permissions === null || permissions === void 0 ? void 0 : permissions.has('CONNECT')) || !(permissions === null || permissions === void 0 ? void 0 : permissions.has('SPEAK')))
                throw new custom_error_1.default('O Jovem! Eu preciso de permissões de falar e conectar!', 'Validation Error');
            const guildId = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id;
            if (!guildId)
                throw new custom_error_1.default('Erro ao identificar servidor.', 'Validation Error');
        };
    }
}
exports.default = new ServerManagerUtils();
