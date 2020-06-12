import { promises as fs } from 'fs'
import aws from 'aws-sdk'
import { config } from './config'
import { FeedlyToken } from './types'

type StoredToken = {
    token: FeedlyToken,
    expires_at: number;
};

const ssm = new aws.SSM();

export async function save_access_token_to_file(token: FeedlyToken) {
    const data: StoredToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in / 2,
    };
    fs.writeFile('./data/feedly_token.txt', JSON.stringify(data));
}

export async function save_access_token(token: FeedlyToken) {
    const data: StoredToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in / 2,
    };
    await ssm.putParameter({
        Name: config.ssm_parameter,
        Type: 'String',
        Value: JSON.stringify(data),
        Overwrite: true,
    }).promise();
}

export async function load_access_token() {
    const content = await ssm.getParameter({Name: config.ssm_parameter}).promise();
    if (!content.Parameter || !content.Parameter.Value) {
        throw new Error(`unable get parameter ... ${config.ssm_parameter}`);
    }
    const data = JSON.parse(content.Parameter.Value) as StoredToken;
    let expired = new Date().getTime() > data.expires_at;
    return { token: data.token, expired };
}
