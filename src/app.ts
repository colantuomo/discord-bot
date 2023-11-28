import { REST, Client, Message, GatewayIntentBits, Events } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice';

import { environment } from './infra/environment'
import db from './db/db'
import Commands from './app/controllers/commands'
import danielDaBahia from './utils/izac';

const main = async () => {
    console.log(`${danielDaBahia} \nBOM DIA MARCELO, INICIOU APLICAÇÃO`)
    const client = new Client({
        intents: ['Guilds', 'GuildMessages', 'MessageContent']
    });
    client?.user?.setPresence({ status: 'dnd' })

    // await db.init()

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

    client.login(environment.token).catch((err) => {
        console.log(err)
    }).then(() => {
        console.log(client.user?.username);
    });
    // new REST({ version: '10' }).setToken(environment.token!);

    client.on(Events.MessageCreate, (e) => {

        console.log("Create", e.content)
    });

    client.on(Events.MessageCreate, async (message: Message) => {
        console.log("Create 2");
        if (message.author.bot) return
        // message.channel.send('Sub é gay');
        if (!message.content.startsWith(environment.prefix)) return

        message.content = message.content.replace(environment.prefix, '');
        const serverId = message.guild?.id;
        const channel = message.channel;

        joinVoiceChannel({ channelId: channel.id, guildId: serverId!, adapterCreator: message.guild?.voiceAdapterCreator! });


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
