const { executeQuery } = require("../database/index");

// Return all company data
const getCompanyData = async () => {
    const sql = "SELECT * FROM company";
    return executeQuery(sql);
};

// Post company info
const AddCompanyInfo = async () => {
	const sql = `
        INSERT IGNORE INTO 
            company(
                Com_name, Com_tin, Com_address, Com_phone, Com_email, Com_id, Com_logo
            ) 
            VALUES (
                ?, ?, ?, ?, ?, ?, ?
            )`;
	return await executeQuery(sql);
};

module.exports = {
    getCompanyData,
    AddCompanyInfo,
}