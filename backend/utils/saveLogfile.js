const fs = require('fs');
const path = require('path');
const { saveMessageLogs, saveSuccessLogs, saveServerLogs, saveErrorLogs, saveAllMessageLogs } = require('../controller/saveLogs');

const logMessage = async(message) =>{
    const logTime = new Date().toLocaleString();
    const log = [ "", logTime, JSON.stringify(message), new Date() ]
    await saveMessageLogs(log);
    return;
}

// Save success messages
const logSuccessMessages = async(message) =>{
    const logTime = new Date().toLocaleString();
    const log = [ "", logTime, JSON.stringify(message), new Date() ]
    await saveSuccessLogs(log);
    return;
}

// Define the path for the log file
const logFilePath = path.join(__dirname, '../logs/serverLogs.txt');
const logServerMessages = async (message) => {
    try {
        const logTime = new Date().toLocaleString();
        const logEntry = `${logTime}: ${JSON.stringify(message)}\n`;
        await fs.promises.appendFile(logFilePath, logEntry);
    } catch (error) {
        return await fs.promises.appendFile(logFilePath, error);
    }
};
// Save server logs
// const logServerMessages = async(message) =>{
//     const logTime = new Date().toLocaleString();
//     const log = [ "", logTime, JSON.stringify(message), new Date() ]
//     await saveServerLogs(log);
//     return;
// }

// Save error messages
const logErrorMessages = async(message) =>{
    const logTime = new Date().toLocaleString();
    const log = [ "", logTime, JSON.stringify(message), new Date() ]
    await saveErrorLogs(log);
    return;
}

// Save error messages
const logAllMessage = async(message) =>{
    const logTime = new Date().toLocaleString();
    const log = [ "", logTime, JSON.stringify(message), new Date() ]
    await saveAllMessageLogs(log);
    return;
}

module.exports = {
    logMessage,
    logSuccessMessages,
    logErrorMessages,
    logServerMessages,
    logAllMessage,
};
