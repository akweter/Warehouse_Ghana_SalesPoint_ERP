const axios = require('axios');
const { logErrorMessages } = require('./saveLogfile');
require('dotenv').config();

const { IP_INFO } = process.env;

// Get user location
async function GetMyIpInfo() {
  try {
    const response = await axios.get(`https://ipinfo.io?token=${IP_INFO}`);
    const newData = response.data;
    return newData;
  } catch (err) {
    logErrorMessages(`Error making a log with ip: ${JSON.stringify(err)}`);
    return null;
  }
}

const Myip = async () => {
  try {
    const ipInfo = await GetMyIpInfo();
    return ipInfo;
  } catch (error) {
    return error;
  }
}

const Data = { Myip }

module.exports = Data;
