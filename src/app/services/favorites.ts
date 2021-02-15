import FavoritesSchema from '../../db/schema/favorites.schema';
import { FavoritesObject } from '../models/favorites.model';
import CommandsDAO from '../dao/commands.dao';
import FavoritesDAO from '../dao/favorites.dao';
import CustomError from '../shared/custom-error';
import ServerManager from './server-manager';
import { Server } from '../models/server-manager.model';

export default class Favorites {
    private server: Server;

    constructor(serverId: string) {
        this.server = ServerManager.getInstance().get(serverId)!;
    }

    async getFavoritesMap() {
        const result: FavoritesObject = {};
        const data = await FavoritesDAO.getFavoritesByServer(this.server.serverId);

        data.forEach((item: any) =>
            result[item.command] = {
                link: item.link,
                isPlaylist: !!item.playlist,
                serverId: item.serverId,
                volume: item.volume
            }
        );

        return result;
    }

    addFavorite = async (message: string): Promise<void> => {
        const command: string = this.getKey(message);

        if (await this.keyAlreadyExists(command))
            throw new CustomError('Comando já utilizado para outra função.', 'Validation Error');

        const link: string = this.getValue(message);
        const isPlaylist: boolean = this.isPlaylist(link);

        await this.upsertFavorite(command, link, isPlaylist);
    }

    refreshFavMap = (message: string): void => {
        const key = this.getKey(message);
        const link = this.getValue(message);
        const isPlaylist = this.isPlaylist(link);

        this.server.favorites[key] = {
            serverId: this.server.serverId,
            link,
            volume: '5',
            isPlaylist,
        };
    }

    showFavoriteCommands = (): void => {
        let favoriteCommands = '```';
        const favorites = this.server!.favorites;

        for (const command in favorites)
            favoriteCommands += `${command} - ${favorites[command].link} \r\n`;

        favoriteCommands += '```';

        this.server.textChannel.send(favoriteCommands);
    }

    getKey(message: string): string {
        const msg = this.getFormattedMessage(message);
        return msg.split('http')[0].trim();
    }

    private getValue(message: string): string {
        const msg = this.getFormattedMessage(message);
        return msg.slice(msg.indexOf('http')).trim();
    }

    private getFormattedMessage(message: string): string {
        const params = new RegExp('[^;fav].+').exec(message);
        return params ? params[0] : '';
    }

    private isPlaylist(message: string): boolean {
        return message.includes('list=');
    }

    private async keyAlreadyExists(key: string) {
        const allComannds: any = await CommandsDAO.getDefaultCommands();

        return (allComannds.filter((item: any) => item.command === key)).length > 0;
    }

    private async upsertFavorite(command: string, link: string, isPlaylist: boolean) {
        const filter = {
            serverId: this.server.serverId,
            command,
        };

        const update = {
            command,
            link,
            isPlaylist,
            volume: 5
        };

        await FavoritesDAO.upsertFavorite(filter, update);
    }
}
