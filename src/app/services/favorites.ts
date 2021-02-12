import FavoritesSchema from '../../db/schema/favorites.schema';
import Help from './help';

class Favorites {
    async getFavoritesMap() {
        let result: any = {};
        const data = await FavoritesSchema.find();

        data.map((item: any) => (
            result[item.command] = {
                link: item.link,
                playlist: item.playlist
            }
        ));
        return result;
    }

    async addFav(message: string) {
        try {
            const key: string = this.getKey(message);

            if (await this.keyAlreadyExists(key)) {
                throw 'Comando já utilizado para outra função.'
            }

            const value: string = this.getValue(message);

            const playlist: boolean = this.isPlaylist(value);

            await this.upsertFavorite(key, value, playlist);
            return { created: true, command: key };
        }
        catch (error) {
            console.log('== ERRO AO INSERIR NOVO FAVORITO == ', error);
            return { created: false, command: '' };
        }
    }

    refreshFavMap(favMap: any, message: string) {
        const key = this.getKey(message);
        const link = this.getValue(message);
        const playlist = this.isPlaylist(link);
        favMap[key] = { link, playlist };
        return favMap;
    }

    async getFavoriteCommands() {
        let result = '```';
        const data = await FavoritesSchema.find();
        data.forEach((item: any) => {
            result += `${item.command} - ${item.link} \r\n`;
        })
        result += '```';
        return result;
    }

    private getKey(message: string): string {
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
        const allComannds: any = await Help.getCommandsMap();
        return key in allComannds;
    }

    private async upsertFavorite(command: string, link: string, playlist: boolean) {
        await FavoritesSchema.updateOne({ command }, { command, link, playlist }, { upsert: true });
    }
}

const instance = new Favorites();
export = instance;
