import express from 'express';
import fs from 'fs';
import path from 'path';
import logger from './services/logger';
import database from './services/database';
import * as appConfig from './configs/app.json';
import * as dbConfig from './configs/db.json';

const APP_PORT = appConfig.port;
const ROUTES_DIR = path.join(__dirname, './routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cors')({
    origin: appConfig.cors_origin
}));

(async function main() {
    logger.info("Initializing app...");

    if(!appConfig.README_confirmation) {
        logger.error("It seems that you did't follow the instruction in README file. Please read it carefully and you will be able to disable this message.");
        process.exit(1);
    }

    try {
        await database.connect(dbConfig.address, dbConfig.port, dbConfig.name);
        logger.warn("Connected to the database without credentials. Don't use this approach in production.");

        let routes = fs.readdirSync(ROUTES_DIR);
        for(const route of routes) {
            app.use(require(`${ROUTES_DIR}/${route}`));
        }

        app.listen(APP_PORT);
    } catch(e) {
        logger.error(`Terminating app due to initialization error: ${e}`);

        process.exit(1);
    }

    logger.info(`App running on port ${APP_PORT}.`);
})();