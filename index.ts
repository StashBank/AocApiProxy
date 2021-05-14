import * as express  from 'express';
import * as cors  from 'cors';
import * as proxy from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const targetWebAppUrl = process.env.TARGET_WEBAPP_URL;

const webAppProxyServer = proxy.createProxyMiddleware('/', {
    target: targetWebAppUrl,
    changeOrigin: true,
    secure: false,
    onProxyRes: (proxyRes, req, res) => {
        const origin = req.headers['origin'] || req.headers['referer'];
        if (origin) {
            proxyRes.headers['access-control-allow-origin'] = origin;
            proxyRes.headers['access-control-allow-credentials'] = 'true';
        }
    }
})

const port = process.env.PORT || 3003;
const app = express();

app.use('/*', webAppProxyServer);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
