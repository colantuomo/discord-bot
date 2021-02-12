import mongoose from "mongoose";

const commandsSchema = new mongoose.Schema({
    command: { type: String, required: true },
    desc: { type: String, required: true }
});

const instance = mongoose.model('Commands', commandsSchema);
export = instance;