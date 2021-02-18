import * as express  from 'express';
import * as cors  from 'cors';
import * as proxy from 'http-proxy-middleware';

const extApiUrl = 'https://accounts.ashesofcreation.com';

const proxyServer = proxy.createProxyMiddleware('/api', {
    target: 'https://accounts.ashesofcreation.com',
    changeOrigin: true,
    secure: false
})

const port = process.env.port || 3000;
const app = express();

app.get('*', (req, res, next) => {
    const authorization = req.headers['authorization'];
    req.headers.cookie = `intrepidUser=${authorization}`;
    next();
});

app.use('*', proxyServer);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
