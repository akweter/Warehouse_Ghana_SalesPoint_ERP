const axios = require('axios');
require('dotenv').config();

const { IP_INFO } = process.env;

// Get user location
async function GetMyIpInfo() {
  try {
    const response = await axios.get(`https://ipinfo.io?token=${IP_INFO}`);
    return await response.data;
  } catch (err) {
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

module.exports = { 
  Myip,
}
