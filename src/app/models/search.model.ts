import { SearchSong } from "./song.model";

interface SearchObject {
    options?: Array<SearchSong>;
    nextMusic?: boolean;
}

interface searchSessionObject {
    [userId: string]: SearchObject;
}

export {
    searchSessionObject,
    SearchObject,
}
