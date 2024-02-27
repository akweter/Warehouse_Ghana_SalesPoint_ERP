const fs = require('fs');
const path = require('path');

function logAllMessage(message) {
    const logTime = new Date().toLocaleString();
    const log = `${logTime}: ${message}\n`;
    const logFilePath = path.join(__dirname, '../logs/allUserActions.txt');
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {return}
    });
}

const Logs = {
    logAllMessage,
}
module.exports = Logs;
