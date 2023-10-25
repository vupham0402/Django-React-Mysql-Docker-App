const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://18.206.158.83:5000',
			changeOrigin: true,
			ws: true, // Enable WebSocket support
		})
	);
};