import querystring from 'querystring'
import { config } from './config'
import { FeedlyToken, FeedlyEntries } from './types'

export function get_authorization_url(redirect_uri: string) {
    const query = querystring.stringify({
        response_type: 'code',
        client_id: config.feedly_client_id,
        redirect_uri: redirect_uri,
        scope: 'https://cloud.feedly.com/subscriptions',
    });
    return `https://cloud.feedly.com/v3/auth/auth?${query}`;
}

export async function authorization(redirect_uri: string, code: string): Promise<FeedlyToken> {
    const res = await fetch('https://cloud.feedly.com/v3/auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: config.feedly_client_id,
            client_secret: config.feedly_client_secret,
            grant_type: 'authorization_code',
            redirect_uri: redirect_uri,
            code: code,
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json() as any;
    return {
        id: data.id,
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token,
    }
}

export async function refresh_access_token(origToken: FeedlyToken): Promise<FeedlyToken> {
    const res = await fetch('https://cloud.feedly.com/v3/auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: config.feedly_client_id,
            client_secret: config.feedly_client_secret,
            grant_type: 'refresh_token',
            refresh_token: origToken.refresh_token,
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json() as any;
    return {
        id: data.id,
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: origToken.refresh_token,
    }
}

export async function fetch_saved_entries(token: FeedlyToken) {
    const params = new URLSearchParams({
        streamId: `user/${token.id}/tag/global.saved`,
        ranked: 'oldest',
    });
    const res = await fetch(`https://cloud.feedly.com/v3/streams/contents?${params}`, {
        headers: {
            Authorization: `OAuth ${token.access_token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json() as FeedlyEntries;
}

export async function unsaved_entries(token: FeedlyToken, entryIds: string[]) {
    const res = await fetch('https://cloud.feedly.com/v3/markers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `OAuth ${token.access_token}`,
        },
        body: JSON.stringify({
            action: 'markAsUnsaved',
            type: 'entries',
            entryIds: entryIds,
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
}
