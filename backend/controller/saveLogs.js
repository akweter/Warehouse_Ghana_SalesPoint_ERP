const { executeQuery } = require("../database/index");

// Save User message logs
const saveMessageLogs = async (message) => {
	const sql = `
        INSERT INTO all_action_logs(
		Act_Log_ID,
        Act_Log_DateTime,
        Act_Log_Message
	) VALUES (
		?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, message);
		if (result) { return result }
	}
	catch (error) {
		return error;
	}
};

// Save User message logs
const saveAllMessageLogs = async (message) => {
	const sql = `
        INSERT INTO all_message_logs(
		Act_Log_ID,
        Act_Log_DateTime,
        Act_Log_Message
	) VALUES (
		?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, message);
		if (result) { return result }
	}
	catch (error) {
		return error;
	}
};

// Save User message logs
const saveSuccessLogs = async (message) => {
	const sql = `
        INSERT INTO all_sucesss_logs(
		Act_Log_ID,
        Act_Log_DateTime,
        Act_Log_Message
	) VALUES (
		?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, message);
		if (result) { return result }
	}
	catch (error) {
		return error;
	}
};

// Save User message logs
const saveErrorLogs = async (message) => {
	const sql = `
        INSERT INTO all_error_logs(
		Act_Log_ID,
        Act_Log_DateTime,
        Act_Log_Message
	) VALUES (
		?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, message);
		if (result) { return result }
	}
	catch (error) {
		return error;
	}
};

// Save User message logs
const saveServerLogs = async (message) => {
	const sql = `
        INSERT INTO all_server_logs(
		Act_Log_ID,
        Act_Log_DateTime,
        Act_Log_Message
	) VALUES (
		?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, message);
		if (result) { return result }
	}
	catch (error) {
		return error;
	}
};

module.exports = {
    saveMessageLogs,
    saveAllMessageLogs,
    saveSuccessLogs,
    saveErrorLogs,
    saveServerLogs,
}