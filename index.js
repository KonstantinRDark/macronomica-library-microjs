var dist;

try {
  dist = require('./dist');
} catch (err) {
  dist = require('./release');
}

module.exports = dist;