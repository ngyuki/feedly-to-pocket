import * as store from './store'
import * as api from './api'
import { post_to_target } from './post'
import { FeedlyEntries } from './types'

export async function handler() {
    let { token, expired } = await store.load_access_token();
    if (expired) {
        token = await api.refresh_access_token(token)
        store.save_access_token(token);
        console.log(`refresh access token`);
    }

    const entries = await api.fetch_saved_entries(token);
    console.log(`fetch ${entries.items.length} entries`);

    const { ids, urls } = filter_entries_response(entries);
    for (const url of urls) {
        console.log(`post ${url}`);
        await post_to_target(url);
    }
    if (ids.length > 0) {
        await api.unsaved_entries(token, ids);
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
