import { Routes } from './routes/routes';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('../service.config.json');

export function start() {
    const port = config.serverPort || 8080;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use('/api', new Routes().getRouter());

    app.listen(port, () => {
        console.log(`Express app listening on port ${port}!`);
    });
}
