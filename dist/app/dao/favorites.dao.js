"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favorites_schema_1 = __importDefault(require("../../db/schema/favorites.schema"));
class FavoritesDAO {
    constructor() {
        this.getFavoritesByServer = async (serverId) => {
            return favorites_schema_1.default.find({ serverId });
        };
        this.upsertFavorite = async (filter, update) => {
            return favorites_schema_1.default.updateOne(filter, update, { upsert: true });
        };
    }
}
exports.default = new FavoritesDAO();
