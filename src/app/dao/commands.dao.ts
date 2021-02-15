import CommandsSchema from '../../db/schema/commands.schema';

class CommandsDAO {
    getDefaultCommands = async (): Promise<any> => {
        return CommandsSchema.find();
    }
}

export default new CommandsDAO();
