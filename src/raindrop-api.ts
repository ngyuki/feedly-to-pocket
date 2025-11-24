import querystring from 'querystring'
import { config } from './config'
import { RaindropToken } from './types'

export function get_authorization_url(redirect_uri: string) {
    const query = querystring.stringify({
        client_id: config.raindrop_client_id,
        redirect_uri: redirect_uri,
        response_type: 'code',
    });
    return `https://api.raindrop.io/v1/oauth/authorize?${query}`;
}

export async function authorization(redirect_uri: string, code: string): Promise<RaindropToken> {
    const res = await fetch('https://raindrop.io/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: config.raindrop_client_id,
            client_secret: config.raindrop_client_secret,
            redirect_uri: redirect_uri,
            code: code,
            grant_type: 'authorization_code',
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json() as any;
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
    }
}

export async function refresh_access_token(origToken: RaindropToken): Promise<RaindropToken> {
    const res = await fetch('https://raindrop.io/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: config.raindrop_client_id,
            client_secret: config.raindrop_client_secret,
            grant_type: 'refresh_token',
            refresh_token: origToken.refresh_token,
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json() as any;
    return {
        access_token: data.access_token,
        refresh_token: origToken.refresh_token, // リフレッシュトークンは通常変わらない
        expires_in: data.expires_in,
        token_type: data.token_type,
    }
}

export async function add(url: string, access_token: string, title?: string) {
    const res = await fetch('https://api.raindrop.io/rest/v1/raindrop', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            link: url,
            title: title || '',
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
}
