import CommandsSchema from '../../schema/commands.schema';
import environment from '../../infra/environment';

class Help {
    async getCommands(){
        return CommandsSchema.find();
    }

    async getCommandsMap() {
        let result: any = {};
        const data = await this.getCommands();
        data.map((item: any) => (
            result[item.command] = item.desc
        ));
        return result;
    }

    async formattedCommands() {
        let result = '```';
        const data = await this.getCommands();
        data.forEach((item: any) => {
            result += `${environment.prefix}${item.command} - ${item.desc}.\r\n`;
        });
        result += '```';
        return result;
    }
}

const instance = new Help();
export = instance;