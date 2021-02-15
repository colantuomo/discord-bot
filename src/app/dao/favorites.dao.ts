import FavoritesSchema from '../../db/schema/favorites.schema';

class FavoritesDAO {
    getFavoritesByServer = async (serverId: string): Promise<any> => {
        return FavoritesSchema.find({ serverId });
    }

    upsertFavorite = async (filter: any, update: any): Promise<any> => {
        return FavoritesSchema.updateOne(filter, update, { upsert: true });
    }
}

export default new FavoritesDAO();
