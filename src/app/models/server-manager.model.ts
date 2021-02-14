import { DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js';
import { searchSessionObject } from './search.model';
import { Song, SearchSong } from './song.model';

interface Server {
    serverId: string;
    textChannel: TextChannel | DMChannel | NewsChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    songs: Array<Song>;
    playing: boolean;
    searchSession: searchSessionObject;
}

export { Server };
