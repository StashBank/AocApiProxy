"use strict";
exports.__esModule = true;
var express = require("express");
var proxy = require("http-proxy-middleware");
var extApiUrl = 'https://accounts.ashesofcreation.com';
var proxyServer = proxy.createProxyMiddleware('/api', {
    target: 'https://accounts.ashesofcreation.com',
    changeOrigin: true,
    secure: false
});
var port = process.env.port || 3000;
var app = express();
app.get('*', function (req, res, next) {
    var authorization = req.headers['authorization'];
    req.headers.cookie = "intrepidUser=" + authorization;
    next();
});
app.use('*', proxyServer);
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
