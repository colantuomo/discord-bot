class ErrorTreatment {

    constructor() { }

    inVoiceChannel(message) {
        return !message.member.voiceChannel ? false : true;
    }

    hasPrefix(message, prefix) {
        return !message.content.startsWith(prefix) ? false : true;
    }
}

module.exports = new ErrorTreatment();
