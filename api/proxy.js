/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  let target = '';

  // 处理代理目标地址
  if (req.url.startsWith('/auth/local')) {
    target = 'http://example.ip/';
  } else if (req.url.startsWith('/blogs')) {
    target = 'http://example.ip/';
  } else if (req.url.includes('/uploads')) {
    target = 'http://example.ip/';
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 /api
      // 例如 /api/boss/xxx 将被转发到 http://example.ip/boss/xxx
      // 例如 /api/front/xxx 将被转发到 http://example.ip/front/xxx
      '^/api': '',
    },
  })(req, res);
}; 