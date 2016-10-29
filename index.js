var dist;

try {
  dist = require('./build');
} catch (err) {
  dist = require('./release');
}

module.exports = dist;