const uuid = require('uuid');

export function generateShortUUID() {
  const fullUUID = uuid.v4().replace(/-/g, '').toUpperCase();
  const alphabetOnly = fullUUID.replace(/[0-9]/g, '');
  return alphabetOnly.substring(0, 6);
}

export function generateUUID() {
  const fullUUID = uuid.v4().replace(/-/g, '').toUpperCase();
  
  // Extract alphabets and numerics
  const alphabets = fullUUID.replace(/[0-9]/g, '').substring(0, 2);
  const numerics = fullUUID.replace(/[A-Z]/g, '').substring(0, 2);
  const remainingAlphabets = fullUUID.replace(/[0-9]/g, '').substring(2, 4); // Remaining alphabets
  
  return `WGWB${numerics}`;
}
