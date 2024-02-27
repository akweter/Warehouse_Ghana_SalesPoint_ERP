const uuid = require('uuid');

function generateUUID() {
  const fullUUID = uuid.v4();
  return fullUUID.replace(/-/g, '').toUpperCase().substring(0, 6);
}

module.exports = generateUUID;
