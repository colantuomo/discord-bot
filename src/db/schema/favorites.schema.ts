import mongoose from "mongoose";

const favoritesSchema = new mongoose.Schema({
    command: { type: String, required: true },
    link: { type: String, required: true },
    isPlaylist: { type: Boolean, required: true },
    volume: { type: String, required: true },
    serverId: { type: String, required: true },
});

const instance = mongoose.model('Favorites', favoritesSchema);
export = instance;
