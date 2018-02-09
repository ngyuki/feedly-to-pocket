import path from 'path'
import { promises as fs } from 'fs'
import { config } from './config'
import { FeedlyToken } from './types'

type StoredToken = {
    token: FeedlyToken,
    expires_at: number;
};

function get_cache_filename() {
    return path.join(config.cache_dir, 'feedly_token.json');
}

export async function save_access_token(token: FeedlyToken) {
    const filename = get_cache_filename();
    const dirname = path.dirname(filename);

    if (!(await fs.stat(dirname)).isDirectory) {
        fs.mkdir(dirname);
    }

    const data: StoredToken = {
        token: token,
        expires_at: new Date().getTime() + token.expires_in / 2,
    };

    await fs.writeFile(filename, JSON.stringify(data));
}

export async function load_access_token() {
    const content = await fs.readFile(get_cache_filename());
    const data = JSON.parse(content.toString()) as StoredToken;

    let expired = new Date().getTime() > data.expires_at;
    return { token: data.token, expired };
}
