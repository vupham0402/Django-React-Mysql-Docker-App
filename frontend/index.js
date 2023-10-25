const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');

require('dotenv').config();

const loginRoute = require('./client/routes/auth/login');
const logoutRoute = require('./client/routes/auth/logout');
const meRoute = require('./client/routes/auth/me');
const registerRoute = require('./client/routes/auth/register');
const verifyRoute = require('./client/routes/auth/verify');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
	// WebSocket connection established
	console.log('WebSocket connection established');
  
	ws.on('message', (message) => {
	  // Handle WebSocket messages
	  console.log(`Received: ${message}`);
	});
});

app.use(express.json());
app.use(cookieParser());

app.use(loginRoute);
app.use(logoutRoute);
app.use(meRoute);
app.use(registerRoute);
app.use(verifyRoute);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
	return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));