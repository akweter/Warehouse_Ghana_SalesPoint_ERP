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

// Save server logs
const logServerMessages = async(message) =>{
    const logTime = new Date().toLocaleString();
    const log = [ "", logTime, JSON.stringify(message), new Date() ]
    await saveServerLogs(log);
    return;
}

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
