const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({
    path: 'variables.env'
});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        // put the userId onto the req for future requests to access
        req.userId = userId;
    }
    next();
});

// Creare a mw that populate the user in each request
server.express.use(async (req, res, next) => {
    if (!req.userId) return next();
    const user = await db.query.user({ where: { id: req.userId } }, '{id, permissions, email, name}');
    req.user = user;
    next();
});

// start server
server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        }
    },
    deets => {
        console.log(`Server running on: http://localhost:${deets.port}`);
    }
);
