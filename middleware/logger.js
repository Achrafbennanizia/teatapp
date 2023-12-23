const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const LOGS_DIRECTORY = process.env.LOGS_DIRECTORY || path.join(__dirname, '..', 'logs');

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()} \t${message} \n`;

    try {
        if (!fs.existsSync(LOGS_DIRECTORY)) {
            await fsPromises.mkdir(LOGS_DIRECTORY);
        }
        await fsPromises.appendFile(path.join(LOGS_DIRECTORY, logFileName), logItem);
    } catch (err) {
        console.error('Error logging event:', err);
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} / ${req.path}`);
    next();
};

module.exports = { logger, logEvents };
