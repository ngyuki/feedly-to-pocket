import http from 'http'
import url from 'url'
import querystring from 'querystring'
import escape from 'escape-html'
import * as feedly from './feedly-api'
import * as store from './store'
import * as pocket from './pocket-api'

http.createServer(async (req, res) => {
    const ok = await handler(req);
    const html = await render(req, ok);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}).listen(8080);

async function handler(req: http.IncomingMessage): Promise<boolean> {
    if (!req.url) {
        return false;
    }
    const { pathname, query } = url.parse(req.url);
    if (!query) {
        return false;
    }
    const params = querystring.parse(query);
    const code = params.code;
    if (!code || Array.isArray(code)) {
        return false;
    }
    if (pathname === '/pocket') {
        const token = await pocket.oauth_authorize(code);
        await store.save_pocket_access_token_to_file(token.access_token);
    } else {
        const token = await feedly.authorization(get_feedly_redirect_uri(req), code);
        await store.save_access_token_to_file(token);
    }
    return true;
}

function get_feedly_redirect_uri(req: http.IncomingMessage) {
    return `http://${req.headers.host}`;
}

function get_pocket_redirect_uri(req: http.IncomingMessage) {
    return `http://${req.headers.host}/pocket`;
}

async function render(req: http.IncomingMessage, ok: boolean) {
    const feedly_authorization_url = feedly.get_authorization_url(get_feedly_redirect_uri(req));
    const pocket_authorize_url = await pocket.get_authorize_url(get_pocket_redirect_uri(req));
    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <title></title>
            </head>
            <body>
                <a href="${escape(feedly_authorization_url)}">Feedly Authorization</a>
                <a href="${escape(pocket_authorize_url)}">Pocket Authorization</a>
                <br>
                ${ok ? 'OK' : ''}
            </body>
        </html>
    `
}
