import axios from 'axios'
import querystring from 'querystring'
import { config } from './config'

async function oauth_request(redirect_uri: string) {
    const res = await axios.post('https://getpocket.com/v3/oauth/request', {
        consumer_key: config.pocket_consumer_key,
        redirect_uri: redirect_uri,
    }, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Accept': 'application/json',
        }
    });
    return res.data as { code: string };
}

export async function get_authorize_url(redirect_uri: string) {
    const res = await oauth_request(redirect_uri);
    const query = querystring.encode({
        request_token: res.code,
        redirect_uri: `${redirect_uri}?${querystring.encode({ code: res.code })}`,
    });
    return `https://getpocket.com/auth/authorize?${query}`;
}

export async function oauth_authorize(code: string) {
    const res = await axios.post('https://getpocket.com/v3/oauth/authorize', {
        consumer_key: config.pocket_consumer_key,
        code: code,
    }, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Accept': 'application/json',
        }
    });
    return res.data as { access_token: string, username: string };
}

export async function add(url: string, access_token: string) {
    const res = await axios.post('https://getpocket.com/v3/add', {
        url: url,
        consumer_key: config.pocket_consumer_key,
        access_token: access_token,
    }, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Accept': 'application/json',
        }
    });
    return res.data as { access_token: string, username: string };
}
