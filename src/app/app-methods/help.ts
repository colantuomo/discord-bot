import { Commands } from '../../schema/commands.schema';

class Help {
    async getCommandsMap() {
        let result: any = {};
        const data = await Commands.find();
        data.map((item: any) => (
            result[item.command] = item.desc
        ));
        return result;
    }

}

const instance = new Help();
export = instance;