import Discord from 'discord.js'
import Favorites from './app/services/favorites'
import QueueService from './app/services/server-manager'
import { environment } from './infra/environment'
import db from './db/db'
import Commands from './app/controllers/commands'

const main = async () => {
    console.log('\nBOM DIA MARCELO, INICIOU APLICAÇÃO')
    const client = new Discord.Client();
    const queueService = QueueService.getInstance();
    client?.user?.setPresence({ status: 'dnd' })

    // await db.init()

    // let favMap = await Favorites.getFavoritesMap()

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

        if (serverId) {
            await new Commands(serverId).handleCommands(message).catch((err) => {
                const errorMessage = err.type === 'Custom' ? err.message : 'Erro ao executar comando';
                message.channel.send(errorMessage);
            });
        } else {
            message.channel.send('Erro ao receber comando');
        }

        // } else if (Shared.command(message, 'favlist')) {
        //     const favList = await Favorites.getFavoriteCommands()
        //     message.channel.send(favList)
        // } else if (Shared.command(message, 'fav')) {
        //     const newFav = await Favorites.addFav(message.content)
        //     if (newFav.created) {
        //         favMap = Favorites.refreshFavMap(favMap, message.content)
        //         message.channel.send(
        //             `Sucesso ao vincular link ao comando ${environment.prefix}${newFav.command}`
        //         )
        //     }
        //     //Comando resposta a uma pesquisa
        // } else if (parseInt(message.content.replace(environment.prefix, ''))) {
        //     if (!(message.author.id in Search.getSearchSession())) {
        //         message.channel.send(
        //             'You have to search for something before choose an item from the list.'
        //         )
        //     } else {
        //         const nextMusic =
        //             Search.getLastCommandById(message.author.id) == 'first'
        //         Play.playSearch(message, serverQueue, nextMusic)
        //     }
        //     //Executando um comando personalizado
        // } else if (Shared.commandIn(message.content, favMap)) {
        //     const key = message.content.replace(environment.prefix, '')
        //     message.content = `play ${favMap[key].link}`

        //     favMap[key].playlist
        //         ? Playlist.addPlaylist(message)
        //         : Play.execute(message, serverQueue, false)
        //     //Helper para listar os comandos
        // } else if (Shared.command(message, 'help')) {
        //     let commands = await Help.formattedCommands()
        //     message.channel.send(commands)
        // } else {
        //     message.channel.send(
        //         `Comando inválido. Caso esteja com dúvida de como utilizar os comandos do bot digite ${environment.prefix}help`
        //     )
        // }


    })
}

main()
