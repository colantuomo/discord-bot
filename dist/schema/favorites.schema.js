"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const favoritesSchema = new mongoose_1.default.Schema({
    command: { type: String, required: true },
    link: { type: String, required: true },
    playlist: { type: Boolean, required: true }
});
const instance = mongoose_1.default.model('Favorites', favoritesSchema);
module.exports = instance;
