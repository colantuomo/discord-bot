import mongoose from "mongoose";

class Db {
    async init() {
        const username = process.env.USER_NAME;
        const passwd = process.env.PASSWD;

        let url = `mongodb+srv://${username}:${passwd}@markin-0cyzi.gcp.mongodb.net/markin-db?retryWrites=true&w=majority`;

        const options = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }

        // recomendação oficial do mongoose para setar essas configurações
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);

        console.log(`\nTrying to connect to mongodb.`);

        // Evento ativado quando o banco de dados é conectado
        mongoose.connection.on('connected', () => {
            console.log(`\nDB: Connected to mongodb (markin-db).`);
        });

        // Evento de erro do mongoose
        mongoose.connection.on('error', (e) => {
            console.error(`\nDB: Mongodb error to connect to Host. | Error: ${e}`);

            this.tryReconect(url, options, 5000);
        });

        // Evento ativado quando o banco de dados é desconectando
        mongoose.connection.on('disconnecting', () => {
            console.log('\nDB: Mongodb is disconnecting!!!');
        });

        // Evento ativado quando o banco de dados é desconectado
        mongoose.connection.on('disconnected', () => {
            console.log('\nDB: Mongodb is disconnected!!!');
        });

        // Evento ativado quando o banco de dados é reconectado
        mongoose.connection.on('reconnected', () => {
            console.log(`\nDB: Mongodb is reconnected.`);
        });

        // Evento ativado quando ocorre timeout na conexão com o banco
        mongoose.connection.on('timeout', (e: any) => {
            console.log(`\nDB: Mongodb timeout to connect. | ${e}`);

            this.tryReconect(url, options, 5000);
        });

        await mongoose.connect(url, options);
    }

    async tryReconect(url: any, options: any, ms: any) {

        console.log(`\nWaiting ${ms / 1000} seconds to retry to connect to mongodb`);

        setTimeout(() => {
            mongoose.connect(url, options)
        }, ms);
    }
}

const instance = new Db();
export = instance;
