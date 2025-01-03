const { executeQuery } = require("../database/index");

// Fetch users' activities
const fetchUsersActivities = async () => {
    const sql = `
        SELECT 
            logs.Act_Log_Message AS logMessage,
            logs.Act_Log_DateTime AS logTime,
            logs.log_type AS logType,
            u.Usr_name AS userName,
            u.Usr_email AS userEmail
        FROM (
            SELECT 
                Acc_userID,
                Act_Log_ID,
                Act_Log_DateTime,
                Act_Log_Message,
                'action' AS log_type
            FROM 
                all_action_logs
            UNION ALL
            SELECT 
                Acc_userID,
                Act_Log_ID,
                Act_Log_DateTime,
                Act_Log_Message,
                'error' AS log_type
            FROM all_error_logs
            UNION ALL
            SELECT 
                Acc_userID,
                Act_Log_ID,
                Act_Log_DateTime,
                Act_Log_Message,
                'message' AS log_type
            FROM all_message_logs
            UNION ALL
            SELECT 
                Acc_userID,
                Act_Log_ID,
                Act_Log_DateTime,
                Act_Log_Message,
                'server' AS log_type
            FROM all_server_logs
            UNION ALL
            SELECT 
                Acc_userID,
                Act_Log_ID,
                Act_Log_DateTime,
                Act_Log_Message,
                'success' AS log_type
            FROM 
                all_sucesss_logs
        ) logs
        LEFT JOIN 
            usermanagement u 
        ON 
            logs.Acc_userID = u.Usr_id
        ORDER BY
            logs.Act_Log_ID DESC;
    `;
    return await executeQuery(sql);
};

module.exports = {
    fetchUsersActivities,
}
