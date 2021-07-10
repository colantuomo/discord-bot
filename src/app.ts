import Discord from 'discord.js'
import { environment } from './infra/environment'
import db from './db/db'
import Commands from './app/controllers/commands'
import danielDaBahia from './utils/izac';

const main = async () => {
    console.log(`${danielDaBahia} \nBOM DIA MARCELO, INICIOU APLICAÇÃO`)
    const client = new Discord.Client();
    client?.user?.setPresence({ status: 'dnd' })

    await db.init()

    client.once('ready', () => {
        console.log('\nBot Connected')
        client?.user?.setPresence({ status: 'online' })
    })

    client.once('reconnecting', () => {
        console.log('Reconnecting!')
    })

    client.once('disconnect', () => {
        console.log('Disconnect!')
    })

    client.login(environment.token)

    client.on('message', async (message: Discord.Message) => {
        if (message.author.bot) return
        if (!message.content.startsWith(environment.prefix)) return

        message.content = message.content.replace(environment.prefix, '');
        const serverId = message.guild?.id;

        if (!serverId) {
            message.channel.send('Erro ao receber comando');
            return;
        }

        await new Commands(serverId).handleCommands(message).catch((err) => {
            console.log('== err: ', err);

            const errorMessage = err.type === 'Custom' ? err.message : 'Erro ao executar comando';
            message.channel.send(errorMessage);
        });
    })
}

main()
