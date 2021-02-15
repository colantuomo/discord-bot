import { DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js';
import { FavoritesObject } from './favorites.model';
import { searchSessionObject } from './search.model';
import { Song } from './song.model';

interface Server {
    serverId: string;
    textChannel: TextChannel | DMChannel | NewsChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    songs: Array<Song>;
    playing: boolean;
    searchSession: searchSessionObject;
    favorites: FavoritesObject;
}

export { Server };
