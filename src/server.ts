import http from 'http'
import url from 'url'
import querystring from 'querystring'
import escape from 'escape-html'
import * as api from './api'
import * as store from './store'

http.createServer(async (req, res) => {
    const ok = await handler(req);
    const authorization_url = api.get_authorization_url();
    const html = render(authorization_url, ok);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}).listen(8080);

async function handler(req: http.IncomingMessage): Promise<boolean> {
    if (!req.url) {
        return false;
    }
    const { query } = url.parse(req.url);
    if (!query) {
        return false;
    }
    const params = querystring.parse(query);
    const code = params.code;
    if (!code || Array.isArray(code)) {
        return false;
    }
    const token = await api.authorization(code);
    await store.save_access_token_to_file(token);
    return true;
}

function render(authorization_url: string, ok: boolean) {
    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <title></title>
            </head>
            <body>
                <a href="${escape(authorization_url)}">authorization</a>
                ${ok ? 'OK' : ''}
            </body>
        </html>
    `
}
