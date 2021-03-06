import Discord from 'discord.js'
// @ts-ignore
import { playlist as Playlist } from './app-methods/playList'
import Play from './app-methods/play'
import Skip from './app-methods/skip'
import Stop from './app-methods/stop'
import Search from './app-methods/search'
import Favorites from './app-methods/favorites'
import Help from './app-methods/help'
import Volume from './app-methods/volume'
import Formatter from './formatter/formatter'
import QueueService from '../service/queue.service'
import Shared from './shared/shared'
import environment from '../infra/environment'
import db from '../db/db'

const main = async () => {
    console.log('\nBOM DIA MARCELO, INICIOU APLICAÇÃO')
    const client = new Discord.Client()
    const queueService = QueueService.getInstance()
    client?.user?.setPresence({ status: 'dnd' })

    await db.init()

    let favMap = await Favorites.getFavoritesMap()

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

    client.on('message', async (message: any) => {
        if (message.author.bot) return
        if (!message.content.startsWith(environment.prefix)) return
        const serverQueue = queueService.get(message?.guild?.id)
        if (Shared.command(message, 'play')) {
            Play.isLink(message.content)
                ? Play.execute(message, serverQueue, false)
                : handleCommand(message, favMap, serverQueue)
        } else if (Shared.command(message, 'first')) {
            Play.isLink(message.content)
                ? Play.execute(message, serverQueue, true)
                : handleCommand(message, favMap, serverQueue)
        } else if (Shared.command(message, 'list')) {
            Playlist.addPlaylist(message)
        } else if (Shared.command(message, 'skip')) {
            Skip.skip(message, serverQueue)
        } else if (Shared.command(message, 'volume')) {
            const msg = message.content.split(' ')
            const volume = msg.length > 1 ? msg[1].toString() : '5'
            serverQueue.connection.dispatcher.setVolume(
                Volume.getVolume(volume)
            )
        } else if (Shared.command(message, 'stop')) {
            Stop.stop(message, serverQueue)
        } else if (Shared.command(message, 'leave')) {
            serverQueue.voice.channel.leave()
        } else if (Shared.command(message, 'queue')) {
            let queue = Formatter.formatQueue(serverQueue)
            message.channel.send(queue)
        } else if (Shared.command(message, 'favlist')) {
            const favList = await Favorites.getFavoriteCommands()
            message.channel.send(favList)
        } else if (Shared.command(message, 'fav')) {
            const newFav = await Favorites.addFav(message.content)
            if (newFav.created) {
                favMap = Favorites.refreshFavMap(favMap, message.content)
                message.channel.send(
                    `Sucesso ao vincular link ao comando ${environment.prefix}${newFav.command}`
                )
            }
            //Comando resposta a uma pesquisa
        } else if (parseInt(message.content.replace(environment.prefix, ''))) {
            if (!(message.author.id in Search.getSearchSession())) {
                message.channel.send(
                    'You have to search for something before choose an item from the list.'
                )
            } else {
                const nextMusic =
                    Search.getLastCommandById(message.author.id) == 'first'
                Play.playSearch(message, serverQueue, nextMusic)
            }
            //Executando um comando personalizado
        } else if (Shared.commandIn(message.content, favMap)) {
            const key = message.content.replace(environment.prefix, '')
            message.content = `play ${favMap[key].link}`

            favMap[key].playlist
                ? Playlist.addPlaylist(message)
                : Play.execute(message, serverQueue, false)
            //Helper para listar os comandos
        } else if (Shared.command(message, 'help')) {
            let commands = await Help.formattedCommands()
            message.channel.send(commands)
        } else {
            message.channel.send(
                `Comando inválido. Caso esteja com dúvida de como utilizar os comandos do bot digite ${environment.prefix}help`
            )
        }
    })
}

const handleCommand = (message: any, favMap: any, serverQueue: any) => {
    const command = message.content.substring(message.content.indexOf(' ') + 1)

    if (Shared.commandIn(command, favMap)) {
        message.content = `play ${favMap[command].link}`
        Play.execute(message, serverQueue, true)
    } else {
        Search.search(message)
    }
}

main()
