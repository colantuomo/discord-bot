class ErrorTreatment {

    constructor() { }

    inVoiceChannel(message) {
        return !message.member.voice.channel ? false : true;
    }

    hasPrefix(message, prefix) {
        return !message.content.startsWith(prefix) ? false : true;
    }
}

module.exports = new ErrorTreatment();
