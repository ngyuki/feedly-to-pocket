import * as store from './store'
import { FeedlyEntries } from './types'
import * as feedly from './feedly-api'
import * as pocket from './pocket-api'

export async function handler() {
    let { token, expired } = await store.load_access_token();
    if (expired) {
        token = await feedly.refresh_access_token(token)
        store.save_access_token(token);
        console.log(`refresh access token`);
    }

    const entries = await feedly.fetch_saved_entries(token);
    console.log(`fetch ${entries.items.length} entries`);

    const { ids, urls } = filter_entries_response(entries);

    if (urls.length > 0) {
        const access_token = await store.load_pocket_access_token();
        for (const url of urls) {
            console.log(`pocket ${url}`);
            await pocket.add(url, access_token);
        }
    }

    if (ids.length > 0) {
        await feedly.unsaved_entries(token, ids);
        console.log(`unsaved ${ids.length} entries`);
    }
}

function filter_entries_response(entries: FeedlyEntries) {
    const ids: string[] = entries.items.map(item => item.id);
    const urls: string[] = entries.items.map(item => {
        if (item.canonicalUrl) {
            return item.canonicalUrl;
        }
        if (item.canonical) {
            for (const canonical of item.canonical) {
                if (canonical.href) {
                    return canonical.href;
                }
            }
        }
        if (item.alternate) {
            for (const canonical of item.alternate) {
                if (canonical.href) {
                    return canonical.href;
                }
            }
        }
        return item.originId;
    });
    return { ids, urls };
}
