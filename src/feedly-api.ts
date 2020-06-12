import axios from 'axios'
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
    const res = await axios.post('http://cloud.feedly.com/v3/auth/token', {
        client_id: config.feedly_client_id,
        client_secret: config.feedly_client_secret,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri,
        code: code,
    });
    return {
        id: res.data.id,
        access_token: res.data.access_token,
        expires_in: res.data.expires_in,
        refresh_token: res.data.refresh_token,
    }
}

export async function refresh_access_token(origToken: FeedlyToken): Promise<FeedlyToken> {
    const res = await axios.post('http://cloud.feedly.com/v3/auth/token', {
        client_id: config.feedly_client_id,
        client_secret: config.feedly_client_secret,
        grant_type: 'refresh_token',
        refresh_token: origToken.refresh_token,
    });
    return {
        id: res.data.id,
        access_token: res.data.access_token,
        expires_in: res.data.expires_in,
        refresh_token: origToken.refresh_token,
    }
}

export async function fetch_saved_entries(token: FeedlyToken) {
    const res = await axios.get('http://cloud.feedly.com/v3/streams/contents', {
        headers: {
            Authorization: `OAuth ${token.access_token}`,
        },
        params: {
            streamId: `user/${token.id}/tag/global.saved`,
            ranked: 'oldest',
        },
    });
    return res.data as FeedlyEntries;
}

export async function unsaved_entries(token: FeedlyToken, entryIds: string[]) {
    await axios.post('http://cloud.feedly.com/v3/markers', null, {
        headers: {
            Authorization: `OAuth ${token.access_token}`,
        },
        data: {
            action: 'markAsUnsaved',
            type: 'entries',
            entryIds: entryIds,
        }
    });
}
