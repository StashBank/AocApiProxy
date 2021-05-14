import * as express  from 'express';
import * as cors  from 'cors';
import * as proxy from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const targetWebAppUrl = process.env.TARGET_WEBAPP_URL;

const webAppProxyServer = proxy.createProxyMiddleware('/', {
    target: targetWebAppUrl,
    changeOrigin: true,
    secure: false
})

const port = process.env.PORT || 3003;
const app = express();

app.use('/*', webAppProxyServer);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
