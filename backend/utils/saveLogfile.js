const fs = require('fs');
const path = require('path');

function logMessage(message) {
    const logTime = new Date().toLocaleString();
    const log = `${logTime}: ${message}\n`;
    const logFilePath = path.join(__dirname, '../logs/userActions.txt');
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {return}
    });
}

// Save success messages
function logSuccessMessages(message) {
    const logTime = new Date().toLocaleString();
    const log = `${logTime}: ${message}\n`;
    const logFilePath = path.join(__dirname, '../logs/successLogs.txt');
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {return}
    });
}

// Save server logs
function logServerMessages(message) {
    const logTime = new Date().toLocaleString();
    const log = `${logTime}: ${message}\n`;
    const logFilePath = path.join(__dirname, '../logs/serverLogs.txt');
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {return}
    });
}
// Save error messages
function logErrorMessages(message) {
    const logTime = new Date().toLocaleString();
    const log = `${logTime}: ${message}\n`;
    const logFilePath = path.join(__dirname, '../logs/errorLogs.txt');
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {return}
    });
}

module.exports = {
    logMessage,
    logSuccessMessages,
    logErrorMessages,
    logServerMessages,
};
