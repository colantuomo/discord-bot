"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
class Db {
    async init() {
        const username = process.env.USER_NAME;
        const passwd = process.env.PASSWD;
        let url = `mongodb+srv://${username}:${passwd}@markin-0cyzi.gcp.mongodb.net/markin-db?retryWrites=true&w=majority`;
        const options = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
        // recomendação oficial do mongoose para setar essas configurações
        mongoose_1.default.set('useNewUrlParser', true);
        mongoose_1.default.set('useFindAndModify', false);
        console.log(`\nTrying to connect to mongodb.`);
        // Evento ativado quando o banco de dados é conectado
        mongoose_1.default.connection.on('connected', () => {
            console.log(`\nDB: Connected to mongodb (markin-db).`);
        });
        // Evento de erro do mongoose
        mongoose_1.default.connection.on('error', (e) => {
            console.error(`\nDB: Mongodb error to connect to Host. | Error: ${e}`);
            this.tryReconect(url, options, 5000);
        });
        // Evento ativado quando o banco de dados é desconectando
        mongoose_1.default.connection.on('disconnecting', () => {
            console.log('\nDB: Mongodb is disconnecting!!!');
        });
        // Evento ativado quando o banco de dados é desconectado
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('\nDB: Mongodb is disconnected!!!');
        });
        // Evento ativado quando o banco de dados é reconectado
        mongoose_1.default.connection.on('reconnected', () => {
            console.log(`\nDB: Mongodb is reconnected.`);
        });
        // Evento ativado quando ocorre timeout na conexão com o banco
        mongoose_1.default.connection.on('timeout', (e) => {
            console.log(`\nDB: Mongodb timeout to connect. | ${e}`);
            this.tryReconect(url, options, 5000);
        });
        await mongoose_1.default.connect(url, options).catch(() => { });
    }
    async tryReconect(url, options, ms) {
        console.log(`\nWaiting ${ms / 1000} seconds to retry to connect to mongodb`);
        setTimeout(() => {
            mongoose_1.default.connect(url, options).catch(() => { });
        }, ms);
    }
}
const instance = new Db();
module.exports = instance;
