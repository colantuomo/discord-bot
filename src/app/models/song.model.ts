interface Song {
    title: string;
    url: string;
    volume: number;
}

interface SearchSong {
    index: number;
    title: string;
    channelTitle: string;
    duration: string;
    id: string;
}

export {
    Song,
    SearchSong,
};
