import YoutubeService from '../../service/youtube.service'
import QueueService from '../../service/queue.service'
import Play from './play'

class Playlist {
    serverQueue: any
    queueService: QueueService

    constructor() {
        this.queueService = QueueService.getInstance()
    }

    async addPlaylist(message: any) {
        const args = message.content.split(' ')
        const voiceChannel = message.member.voice.channel
        let songsList = []
        //pega a penas a url do youtube e manda para o metodo getPlaylistData para pegar a lista de musicas
        const playlistData = await this.getPlaylistData(args[1], '')
        if (playlistData.errormessage) {
            message.channel.send(
                'Então meu querido, deu um erro aqui para identificar o id dessa playlist. Tenta de novo, mas se não der não deu.'
            )
            return
        }
        let nextPageToken = playlistData.nextPageToken
        const numberPages =
            playlistData.pageInfo.totalResults /
            playlistData.pageInfo.resultsPerPage
        for (let page = 1; page <= numberPages; page++) {
            const newPage = await this.getPlaylistData(args[1], nextPageToken)
            nextPageToken = newPage.nextPageToken
            playlistData.items.push(...newPage.items)
        }
        // Faz um for na lista de musicas para pegar o nome e url do video
        for (let item of playlistData.items) {
            this.serverQueue = this.queueService.get(message.guild.id)
            const linkYoutube =
                'https://www.youtube.com/watch?v=' +
                item.snippet.resourceId.videoId +
                '&playlists=' +
                item.snippet.playlistId
            const song = {
                title: item.snippet.title,
                url: linkYoutube,
            }
            songsList.push(song)
        }
        // Constroi o obj para adicionar na fila do markin
        // Todo o processo daqui para baixo pode ser separado em outros metodos,
        // pois esse codigo esta sendo repetido no metodo 'execute', mas foi colocado aqui direto para testar playlist
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: songsList,
            volume: 0.05,
            playing: true,
        }

        this.queueService.set(message.guild.id, queueContruct)
        try {
            var connection = await voiceChannel.join()
            queueContruct.connection = connection
            Play.play(message.guild, queueContruct.songs[0])
        } catch (err) {
            message.channel.send(
                'I encountered a problem connecting to the voice channel ',
                JSON.stringify(err)
            )
            this.queueService.delete(message.guild.id)
        }
    }

    async getPlaylistData(url: string, nextPageToken = '') {
        try {
            const result = await YoutubeService.getPlaylist(url, nextPageToken)
            return result.data
        } catch (error) {
            console.log('== Error: ', error)
            return { errormessage: error }
        }
    }
}

const instance = new Playlist()
export = instance
