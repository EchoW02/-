const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api', // 你想要代理的API路径
        createProxyMiddleware({
            target: 'http://localhost:5000', // 目标服务器地址
            changeOrigin: true,
        })
    );
}; 