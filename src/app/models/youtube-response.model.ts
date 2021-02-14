interface SearchItem {
    kind: any;
    etag: any;
    id: {
        kind: string;
        videoId: string;
        channelId: string;
        playlistId: string
    };
    snippet: {
        publishedAt: Date;
        channelId: string;
        title: string;
        description: string;
        thumbnails: Function;
        channelTitle: string
    }
}

interface SearchListResponse {
    kind: any;
    etag: any;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number
    };
    items: Array<SearchItem>;
}

interface VideoItem {
    kind: any;
    etag: any;
    id: string;
    snippet: {
        publishedAt: Date;
        channelId: string;
        title: string;
        description: string;
        thumbnails: Function;
        channelTitle: string;
        tags: [
            string
        ];
        categoryId: string
    };
    contentDetails: {
        duration: string;
        dimension: string;
        definition: string;
        caption: string;
        licensedContent: boolean;
        regionRestriction: {
            allowed: [
                string
            ];
            blocked: [
                string
            ]
        };
        contentRating: {
            mpaaRating: string;
            tvpgRating: string;
            bbfcRating: string;
            chvrsRating: string;
            eirinRating: string;
            cbfcRating: string;
            fmocRating: string;
            icaaRating: string;
            acbRating: string;
            oflcRating: string;
            fskRating: string;
            kmrbRating: string;
            djctqRating: string;
            russiaRating: string;
            rtcRating: string;
            ytRating: string
        }
    };
    status: {
        uploadStatus: string;
        failureReason: string;
        rejectionReason: string;
        privacyStatus: string;
        license: string;
        embeddable: boolean;
        publicStatsViewable: boolean
    };
    statistics: {
        viewCount: number;
        likeCount: number;
        dislikeCount: number;
        favoriteCount: number;
        commentCount: number
    };
    player: {
        embedHtml: string
    };
    topicDetails: {
        topicIds: [
            string
        ];
        relevantTopicIds: [
            string
        ]
    };
    recordingDetails: {
        locationDescription: string;
        location: {
            latitude: number;
            longitude: number;
            altitude: number
        };
        recordingDate: Date
    };
    fileDetails: {
        fileName: string;
        fileSize: number;
        fileType: string;
        container: string;
        videoStreams: [
            {
                widthPixels: number;
                heightPixels: number;
                frameRateFps: number;
                aspectRatio: number;
                codec: string;
                bitrateBps: number;
                rotation: string;
                vendor: string
            }
        ];
        audioStreams: [
            {
                channelCount: number;
                codec: string;
                bitrateBps: number;
                vendor: string
            }
        ];
        durationMs: number;
        bitrateBps: number;
        recordingLocation: {
            latitude: number;
            longitude: number;
            altitude: number
        };
        creationTime: string
    };
    processingDetails: {
        processingStatus: string;
        processingProgress: {
            partsTotal: number;
            partsProcessed: number;
            timeLeftMs: number
        };
        processingFailureReason: string;
        fileDetailsAvailability: string;
        processingIssuesAvailability: string;
        tagSuggestionsAvailability: string;
        editorSuggestionsAvailability: string;
        thumbnailsAvailability: string
    };
    suggestions: {
        processingErrors: [
            string
        ];
        processingWarnings: [
            string
        ];
        processingHints: [
            string
        ];
        tagSuggestions: [
            {
                tag: string;
                categoryRestricts: [
                    string
                ]
            }
        ];
        editorSuggestions: [
            string
        ]
    }
}

interface VideoListResponse {
    kind: any;
    etag: any;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number
    };
    items: Array<VideoItem>;
}

export {
    SearchListResponse,
    SearchItem,
    VideoListResponse,
    VideoItem,
}
