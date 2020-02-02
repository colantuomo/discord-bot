import environment from '../../infra/environment';

class Shared {
    // Verificar tipo do Message
    command(message: any, param: string): boolean {
        return message.content.startsWith(environment.prefix + param);
    }
}

const instance = new Shared();
export = instance;