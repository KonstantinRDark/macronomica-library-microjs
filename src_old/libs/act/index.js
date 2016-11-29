import provideCall from './../../utils/provide-call';
import makeMsg from './../../utils/make-msg';
import actProxyClientExec from './act-proxy-client-exec';
import updateDuration from './../../utils/update-duration';
import {QUEUE_CASE, ACTION_IN, ACTION_OUT, ACTION_ERR} from './constants';

// Добавляет маршрут
export default function actExec(micro, raw, callback = () => {}) {
  micro.queue({
    case: QUEUE_CASE,
    callback: (next) => {
      const msg = makeMsg(raw);
      const { request } = msg;
  
      if (!request.actionId) {
        request.actionId = micro.actionManager.find(msg.params);
      }
  
      done(micro, msg, (err, result) => {
        provideCall(micro.api, callback(err, result));
        next(err);
      });
    }
  });

  return micro;
};

function done(micro, msg, callback) {
  const { transport, request, params } = msg;
  const actionId = request.actionId || micro.actionManager.find(params);
  const action = micro.actions[ actionId ];
  const _handleError = handleError({ micro, request, callback });

  micro.logger.info({ ...request, action: ACTION_IN, payload: params });

  if (!action) {
    _handleError({
      code    : 'error.act/route.not.found',
      message : `Маршрут ${ JSON.stringify(params) } не найден`
    });
    return micro;
  }

  provideCall(actProxyClientExec(micro.api, request), action.callback(params))
    .then(handleSuccess({ micro, request, callback }), _handleError);
}

function handleSuccess ({ micro, request, callback }) {
  return result => {
    updateDuration(request);
    provideCall(micro.api, callback(null, result));
    micro.logger.info({ ...request, action: ACTION_OUT, payload: result });
  };
}

function handleError ({ micro, request, callback }) {
  return error => {
    updateDuration(request);
    provideCall(micro.api, callback(error));
    micro.logger.error({ ...request, action: ACTION_ERR, error });
  };
}