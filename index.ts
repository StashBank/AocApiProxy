import * as express  from 'express';
import * as cors  from 'cors';
import * as proxy from 'http-proxy-middleware';

const targetApiUrl = process.env.TARGET_API_URL || 'https://accounts.ashesofcreation.com';

const proxyServer = proxy.createProxyMiddleware('/', {
    target: targetApiUrl,
    changeOrigin: true,
    secure: false,
    onProxyRes: (proxyRes, req, res) => {
        const origin = req.headers['origin'] || req.headers['referer'];
        if (origin) {
            proxyRes.headers['access-control-allow-origin'] =  origin;
        }
    }
})

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => res.send('AOC API Proxy server'));

app.get('*', (req, res, next) => {
    const authorization = req.headers['authorization'];
    req.headers.cookie = `intrepidUser=${authorization}`;
    next();
});

app.use('/api/*', proxyServer);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
