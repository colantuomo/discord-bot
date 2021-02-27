"use strict";
class Stop {
    stop(message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.textChannel.send('Bye bye! :)');
        serverQueue.connection.dispatcher.end();
    }
}
const instance = new Stop();
module.exports = instance;
