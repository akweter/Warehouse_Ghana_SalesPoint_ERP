const { executeQuery } = require("../database/index");

// Fetch deliveries
const fetchUsersActivities = async () => {
	const sql = `
        SELECT
            a.Act_Log_Message As actionMsg,
            a.Act_Log_DateTime As actionTime,
            u.Usr_name As userName,
            u.Usr_email As userEmail,
            ac.Act_Log_DateTime As acllActionMsg,
            ac.Act_Log_Message As allActionTime
        FROM
            all_message_logs a
        LEFT JOIN
            usermanagement u ON a.Acc_userID = u.Usr_id
        LEFT JOIN
            all_action_logs ac ON u.Usr_id = ac.Acc_userID
        ORDER BY
            ac.Act_Log_ID DESC;
    `;
	return await executeQuery(sql);
}

module.exports = {
    fetchUsersActivities,
}

