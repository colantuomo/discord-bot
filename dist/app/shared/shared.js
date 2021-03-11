"use strict";
const environment_1 = require("../../infra/environment");
class Shared {
    // Verificar tipo do Message
    command(message, param) {
        return message.content.startsWith(environment_1.environment.prefix + param);
    }
    commandIn(message, map) {
        const command = message.replace(environment_1.environment.prefix, '');
        return command in map;
    }
}
const instance = new Shared();
module.exports = instance;
