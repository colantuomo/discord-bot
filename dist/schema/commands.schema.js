"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const commandsSchema = new mongoose_1.default.Schema({
    command: { type: String, required: true },
    desc: { type: String, required: true }
});
const instance = mongoose_1.default.model('Commands', commandsSchema);
module.exports = instance;
