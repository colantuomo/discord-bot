"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const environment_1 = __importDefault(require("../../infra/environment"));
class Shared {
    // Verificar tipo do Message
    command(message, param) {
        return message.content.startsWith(environment_1.default.prefix + param);
    }
    commandIn(message, map) {
        const command = message.replace(environment_1.default.prefix, '');
        return command in map;
    }
}
const instance = new Shared();
module.exports = instance;
