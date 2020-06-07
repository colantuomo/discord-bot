import mongoose from "mongoose";

const commandsSchema = new mongoose.Schema({
    command: { type: String, required: true },
    desc: { type: String, required: true }
});

const Commands = mongoose.model('Commands', commandsSchema);
export { Commands };