class Stop {
    stop(message: any, serverQueue: any) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.textChannel.send('Bye bye! :)');
        serverQueue.connection.dispatcher.end();
    }
}

const instance = new Stop();
export = instance;