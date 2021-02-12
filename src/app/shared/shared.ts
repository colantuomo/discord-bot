import { environment } from '../../infra/environment';

class Shared {
    // Verificar tipo do Message
    command(message: any, param: string): boolean {
        return message.content.startsWith(environment.prefix + param);
    }

    commandIn(message: any, map: Map<String, String>): boolean {
        const command = message.replace(environment.prefix, '');
        return command in map;
    }
}

const instance = new Shared();
export = instance;
