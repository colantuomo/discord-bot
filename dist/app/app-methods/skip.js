"use strict";
class Skip {
    skip(message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue)
            return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    }
}
const instance = new Skip();
module.exports = instance;
