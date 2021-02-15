interface FavoritesInfo {
    serverId: string;
    link: string;
    volume: string;
    isPlaylist: boolean;
}

interface FavoritesObject {
    [key: string]: FavoritesInfo;
}

export {
    FavoritesObject,
    FavoritesInfo,
};
