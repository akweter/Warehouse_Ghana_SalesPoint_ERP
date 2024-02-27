const LRU = require('lru-cache');
const cache = new LRU({ max: 100, maxAge: 5 * 60 * 1000 });
module.exports = cache;
