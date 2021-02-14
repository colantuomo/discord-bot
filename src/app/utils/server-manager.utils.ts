import { Message } from "discord.js";
import CustomError from "../shared/custom-error";

class ServerManagerUtils {
    validateServerConf = (message: Message): void => {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel)
            throw new CustomError('Oh cabeção! você precisa estar em um canal de voz pra ouvir musica, né?!', 'Validation Error');

        const user = message.client.user;
        if (!user)
            throw new CustomError('Erro ao identificar usuário.', 'Validation Error');

        const permissions = voiceChannel.permissionsFor(user);
        if (!permissions?.has('CONNECT') || !permissions?.has('SPEAK'))
            throw new CustomError('O Jovem! Eu preciso de permissões de falar e conectar!', 'Validation Error');

        const guildId = message.guild?.id;
        if (!guildId)
            throw new CustomError('Erro ao identificar servidor.', 'Validation Error');
    }
}

export default new ServerManagerUtils();
