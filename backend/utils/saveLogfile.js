const fs = require('fs');
const path = require('path');
const { saveMessageLogs, saveSuccessLogs, saveErrorLogs, saveAllMessageLogs } = require('../controller/saveLogs');

const logMessage = async(message, userID) =>{
    const logTime = new Date().toLocaleString();
    const log = [userID, "", logTime, message]
    return await saveMessageLogs(log);
}

// Save success messages
const logSuccessMessages = async(message, userID) =>{
    const logTime = new Date().toLocaleString();
    const log = [userID, "", logTime, message]
    return await saveSuccessLogs(log);
}

// Define the path for the log file
const logFilePath = path.join(__dirname, '../logs/serverLogs.txt');
const logServerMessages = async (message) => {
    try {
        const logTime = new Date().toLocaleString();
        const logEntry = `${logTime}: ${message}\n`;
        await fs.promises.appendFile(logFilePath, logEntry);
    } catch (error) {
        return await fs.promises.appendFile(logFilePath, error);
    }
};

// Save server logs to DB
// const logServerMessages = async(message) =>{
//     const logTime = new Date().toLocaleString();
//     const log = [ "", logTime, message]
//     return await saveServerLogs(log);
// }

// Save error messages
const logErrorMessages = async(message, userID) =>{
    const logTime = new Date().toLocaleString();
    const log = [userID, "", logTime, message]
    return await saveErrorLogs(log);
}

// Save error messages
const logAllMessage = async(message, userID) =>{
    const logTime = new Date().toLocaleString();
    const log = [userID, '', logTime, message]
    return await saveAllMessageLogs(log);
}

module.exports = {
    logMessage,
    logSuccessMessages,
    logErrorMessages,
    logServerMessages,
    logAllMessage,
};
