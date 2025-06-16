export type FeedlyToken = {
    id: string,
    access_token: string,
    expires_in: number,
    refresh_token: string,
};

export type RaindropToken = {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    token_type: string,
};

export type FeedlyEntries = {
    items: [FeedlyEntry],
};

export type FeedlyEntry = {
    id: string,
    originId: string,
    title: string,
    alternate: [{
        href: string,
    }],
    canonicalUrl: string,
    canonical: [{
        href: string
    }],
};
