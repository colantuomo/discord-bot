import {
    Message,
} from 'discord.js';

import CustomError from '../shared/custom-error'

export default class PlayUtils {
    constructor() {
        //
    }

    isLink = (content: string): boolean => {
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        const regex = new RegExp(expression);
        return content?.match(regex) ? true : false;
    }

    validateServerConf = (message: Message): void => {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) {
            throw new CustomError('Oh cabeção! você precisa estar em um canal de voz pra ouvir musica, né?!');
        }

        const user = message.client.user;
        if (!user) {
            throw new CustomError('Erro ao identificar usuário.', 'Validation Error');
        }

        const permissions = voiceChannel.permissionsFor(user);
        if (!permissions?.has('CONNECT') || !permissions?.has('SPEAK')) {
            throw new CustomError('O Jovem! Eu preciso de permissões de falar e conectar!', 'Validation Error');
        }

        const guildId = message.guild?.id;
        if (!guildId) {
            throw new CustomError('Erro ao identificar servidor.', 'Validation Error');
        }
    }
}
