import WrappedError from 'error/wrapped';
import os from 'os';
import bodyParser from 'body-parser';
import iterate from './../../../../utils/iterate';

const jsonBodyParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const preprocessors = [
  jsonBodyParser,
  urlencodedParser
];

const ERROR_TYPE = 'micro.plugin.http-node';

const PreprocessorsParseError = WrappedError({
  message: [
    '{name} - ошибка парсисинга препросессора для запроса (url={url})',
    '{name} - {origMessage}',
  ].join(os.EOL),
  type: `${ ERROR_TYPE }.apply.preprocessors`,
  code: 500,
  url : null
});

export default function applyPreprocessors(app, req, res, url) {
  return new Promise((resolve, reject) => {
    iterate(req.method === 'POST' ? preprocessors : [], req, res, (err) => {
      if (err) {
        let error = PreprocessorsParseError(err, { url });
        app.log.error(error.message, { error });
        return reject(error);
      }

      resolve();
    });
  });
}