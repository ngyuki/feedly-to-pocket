import { promises as fs } from 'fs'
import { SSM } from '@aws-sdk/client-ssm'
import { config } from './config'
import { FeedlyToken, RaindropToken } from './types'

type StoredToken = {
    token: FeedlyToken,
    expires_at: number;
};

type StoredRaindropToken = {
    token: RaindropToken,
    expires_at: number;
};

const ssm = new SSM();

export async function save_access_token_to_file(token: FeedlyToken) {
    const data: StoredToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in / 2,
    };
    fs.writeFile('./data/feedly_token.txt', JSON.stringify(data));
}

export async function save_raindrop_access_token_to_file(token: RaindropToken) {
    const data: StoredRaindropToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in * 1000 / 2, // expires_in は秒単位
    };
    fs.writeFile('./data/raindrop_token.txt', JSON.stringify(data));
}

export async function save_access_token(token: FeedlyToken) {
    const data: StoredToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in / 2,
    };
    await ssm.putParameter({
        Name: config.ssm_parameter_feedly,
        Type: 'String',
        Value: JSON.stringify(data),
        Overwrite: true,
    });
}

export async function load_access_token() {
    const content = await ssm.getParameter({Name: config.ssm_parameter_feedly});
    if (!content.Parameter || !content.Parameter.Value) {
        throw new Error(`unable get parameter ... ${config.ssm_parameter_feedly}`);
    }
    const data = JSON.parse(content.Parameter.Value) as StoredToken;
    let expired = new Date().getTime() > data.expires_at;
    return { token: data.token, expired };
}

export async function save_raindrop_access_token(token: RaindropToken) {
    const data: StoredRaindropToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in * 1000 / 2,
    };
    await ssm.putParameter({
        Name: config.ssm_parameter_raindrop,
        Type: 'String',
        Value: JSON.stringify(data),
        Overwrite: true,
    });
}

export async function load_raindrop_access_token() {
    const content = await ssm.getParameter({Name: config.ssm_parameter_raindrop});
    if (!content.Parameter || !content.Parameter.Value) {
        throw new Error(`unable get parameter ... ${config.ssm_parameter_raindrop}`);
    }
    const data = JSON.parse(content.Parameter.Value) as StoredRaindropToken;
    let expired = new Date().getTime() > data.expires_at;
    return { token: data.token, expired };
}
