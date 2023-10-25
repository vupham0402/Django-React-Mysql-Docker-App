const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://18.205.190.202:5000',
			changeOrigin: true,
		})
	);
};