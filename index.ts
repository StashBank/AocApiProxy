import * as express  from 'express';
import * as cors  from 'cors';
import * as proxy from 'http-proxy-middleware';

const targetApiUrl = process.env.TARGET_API_URL || 'https://accounts.ashesofcreation.com';

const proxyServer = proxy.createProxyMiddleware('/', {
    target: targetApiUrl,
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
        const authorization = req.headers['authorization'];
        console.log('AUTH_TOKEN %s', authorization);
        proxyReq.setHeader('Cookie', `intrepidUser=${authorization}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        const origin = req.headers['origin'] || req.headers['referer'];
        if (origin) {
            proxyRes.headers['access-control-allow-origin'] =  origin;
        }
    }
})

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => res.send(`
    <div style="height: 100%;width:100%;display:flex;justify-content:center;align-items:center">
        <div>
            <p>AOC API Proxy server</p>
            <p>Target is: ${process.env.TARGET_API_URL}</p>
        </div>
    </div>
`));

app.use('/api/*', proxyServer);

app.use('/shop', (req, res) => {
    res.redirect('https://aoc-op.web.app/shop')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
