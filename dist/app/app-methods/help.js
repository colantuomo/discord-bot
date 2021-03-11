"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const commands_schema_1 = __importDefault(require("../../schema/commands.schema"));
const environment_1 = __importDefault(require("../../infra/environment"));
class Help {
    async getCommands() {
        return commands_schema_1.default.find();
    }
    async getCommandsMap() {
        let result = {};
        const data = await this.getCommands();
        data.map((item) => (result[item.command] = item.desc));
        return result;
    }
    async formattedCommands() {
        let result = '```';
        const data = await this.getCommands();
        data.forEach((item) => {
            result += `${environment_1.default.prefix}${item.command} - ${item.desc}.\r\n`;
        });
        result += '```';
        return result;
    }
}
const instance = new Help();
module.exports = instance;
