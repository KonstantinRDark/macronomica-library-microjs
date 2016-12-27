'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = applyPreprocessors;

var _wrapped = require('error/wrapped');

var _wrapped2 = _interopRequireDefault(_wrapped);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _iterate = require('./../../../../utils/iterate');

var _iterate2 = _interopRequireDefault(_iterate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jsonBodyParser = _bodyParser2.default.json();
const urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });

const preprocessors = [jsonBodyParser, urlencodedParser];

const ERROR_TYPE = 'micro.plugin.http-node';

const PreprocessorsParseError = (0, _wrapped2.default)({
  message: ['{name} - ошибка парсисинга препросессора для запроса (url={url})', '{name} - {origMessage}'].join(_os2.default.EOL),
  type: `${ ERROR_TYPE }.apply.preprocessors`,
  code: 500,
  url: null
});

function applyPreprocessors(app, req, res, url) {
  return new _promise2.default((resolve, reject) => {
    (0, _iterate2.default)(req.method === 'POST' ? preprocessors : [], req, res, err => {
      if (err) {
        let error = PreprocessorsParseError(err, { url });
        app.log.error(error.message, { error });
        return reject(error);
      }

      resolve();
    });
  });
}
//# sourceMappingURL=apply-preprocessors.js.map