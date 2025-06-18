import * as store from './store'
import { FeedlyEntries } from './types'
import * as feedly from './feedly-api'
import * as raindrop from './raindrop-api'

export async function handler() {
    let { token, expired } = await store.load_access_token();
    if (expired) {
        token = await feedly.refresh_access_token(token)
        store.save_access_token(token);
        console.log(`refresh access token`);
    }

    const entries = await feedly.fetch_saved_entries(token);
    console.log(`fetch ${entries.items.length} entries`);

    const { ids, items } = filter_entries_response(entries);

    if (items.length > 0) {
        let { token: raindropToken, expired: raindropExpired } = await store.load_raindrop_access_token();
        if (raindropExpired) {
            raindropToken = await raindrop.refresh_access_token(raindropToken);
            store.save_raindrop_access_token(raindropToken);
            console.log(`refresh raindrop access token`);
        }
        for (const item of items) {
            console.log(`raindrop ${item.url} - ${item.title}`);
            await raindrop.add(item.url, raindropToken.access_token, item.title);
        }
    }

    if (ids.length > 0) {
        await feedly.unsaved_entries(token, ids);
        console.log(`unsaved ${ids.length} entries`);
    }
}

function filter_entries_response(entries: FeedlyEntries) {
    const ids: string[] = entries.items.map(item => item.id);
    const items: { url: string, title: string }[] = entries.items.map(item => {
        let url: string = '';
        if (item.canonicalUrl) {
            url = item.canonicalUrl;
        } else if (item.canonical) {
            for (const canonical of item.canonical) {
                if (canonical.href) {
                    url = canonical.href;
                    break;
                }
            }
        } else if (item.alternate) {
            for (const canonical of item.alternate) {
                if (canonical.href) {
                    url = canonical.href;
                    break;
                }
            }
        } else {
            url = item.originId;
        }
        return { url, title: item.title };
    });
    return { ids, items };
}
