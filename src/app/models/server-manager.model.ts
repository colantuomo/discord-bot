import { DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js';
import { Song } from './song.model';

interface Server {
    serverId: string;
    textChannel: TextChannel | DMChannel | NewsChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    songs: Array<Song>;
    playing: boolean;
}

export { Server };
