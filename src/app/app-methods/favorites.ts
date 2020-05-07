import FavoritesSchema from '../../schema/favorites.schema';
import Help from '../app-methods/help';

class Favorites {
    async getFavoritesMap() {
        let result: any = {};
        const data = await FavoritesSchema.find();
        
        data.map((item: any) => (
            result[item.command] = item.link
            ));
        return result;
    }

    async addFav(message: string) {
        try {
            const key = this.getKey(message);

            if (await this.keyAlreadyExists(key)){
                throw 'Comando já utilizado para outra função.'
            }

            const value = this.getValue(message);

            await this.upsertFavorite(key, value);
            return true;
        }
        catch (error) {
            console.log('== ERRO AO INSERIR NOVO FAVORITO == ', error);
            return false;
        }
    }

    getFormattedMessage(message: string){
        const params = new RegExp('[^;fav].+').exec(message);
        return params ? params[0] : '';
    }

    getKey(message: string){
        const msg = this.getFormattedMessage(message);
        return msg.split('http')[0].trim();
    }

    getValue(message: string){
        const msg = this.getFormattedMessage(message);
        return msg.slice(msg.indexOf('http')).trim();
    }

    async keyAlreadyExists(key: string) {
        const allComannds = await Help.getCommandsMap();
        return key in allComannds;
    }

    async upsertFavorite(command: string, link: string) {
        await FavoritesSchema.updateOne({ command }, { command, link }, { upsert: true });
    }

    refreshFavMap(favMap: any, message: string){
        const key = this.getKey(message);
        const value = this.getValue(message);
        favMap[key] = value;
        return favMap;
    }

    async getFavoriteCommands(){
        let result = '```';
        const data = await FavoritesSchema.find();
        data.forEach((item: any) => {
            result += `${item.command} - ${item.link} \r\n`;
        })
        result += '```';
        return result;
    }
}

const instance = new Favorites();
export = instance;