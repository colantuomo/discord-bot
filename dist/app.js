"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const environment_1 = require("./infra/environment");
const db_1 = __importDefault(require("./db/db"));
const commands_1 = __importDefault(require("./app/controllers/commands"));
const main = async () => {
    var _a;
    console.log('\nBOM DIA MARCELO, INICIOU APLICAÇÃO');
    const client = new discord_js_1.default.Client();
    (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.setPresence({ status: 'dnd' });
    await db_1.default.init();
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
    client.login(environment_1.environment.token);
    client.on('message', async (message) => {
        var _a;
        if (message.author.bot)
            return;
        if (!message.content.startsWith(environment_1.environment.prefix))
            return;
        message.content = message.content.replace(environment_1.environment.prefix, '');
        const serverId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!serverId) {
            message.channel.send('Erro ao receber comando');
            return;
        }
        await new commands_1.default(serverId).handleCommands(message).catch((err) => {
            console.log('== err: ', err);
            const errorMessage = err.type === 'Custom' ? err.message : 'Erro ao executar comando';
            message.channel.send(errorMessage);
        });
    });
};
main();
