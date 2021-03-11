"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_schema_1 = __importDefault(require("../../db/schema/commands.schema"));
class CommandsDAO {
    constructor() {
        this.getDefaultCommands = async () => {
            return commands_schema_1.default.find();
        };
    }
}
exports.default = new CommandsDAO();
