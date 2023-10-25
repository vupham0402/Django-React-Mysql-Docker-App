const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'hmarketexpress',
			changeOrigin: true,
			ws: true, // Enable WebSocket support
		})
	);
};