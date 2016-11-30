# Приложение обертка для запуска микросервисов
* **Source**: [Git](https://gitlab.com/microjs/microjs.git)
* **Language**: JavaScript
* **Engine**: [Node.js v6.5.0](https://nodejs.org/dist/latest-v6.x/)

## Примеры использования

### Минимум настроек
```javascript
import Micro from '@microjs/microjs';

const micro = Micro();

micro
  .run()
  .then(() => micro.act('cmd:ping'))
  .then(micro.log.info)
  .catch(micro.log.error);
```

### Замена логера по умолчанию на WinstonJS
```javascript
// TODO логер winston пока что без настроек
import Micro, { WinstonLogPlugin } from '@microjs/microjs';

const micro = Micro()
  .use(WinstonLogPlugin());

micro
  .run()
  .then(() => micro.act('cmd:ping'))
  .then(micro.log.info)
  .catch(micro.log.error);
```

### Замена уровня логирования
```javascript
import Micro, { LEVEL_ERROR } from '@microjs/microjs';

const micro = Micro({ level: LEVEL_ERROR });

micro
  .run()
  .then(micro => client.act('cmd:ping'))
  .then(client.log.info)
  .catch(client.log.error);
```

### PingPong между приложениями
```javascript
import Micro from '@microjs/microjs';

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };
const worker = Micro({ listen });
const client = Micro().api('worker', listen);

Promise
  // Запустим приложения
  .all([ worker.run(), client.run() ])
  // Обратимся по API из client -> worker
  .then(([ worker, client ]) => client.act('api:worker, cmd:ping'))
  // Выведем результат в лог
  .then(client.log.info)
  // Остановим запущенные приложения за ненадобностью
  .then(() => Promise.all([ worker.end(), client.end() ]))
  .catch(client.log.error);
```

### Обращение через сторонние библиотеки (например node-fetch)
```javascript
import fetch from 'node-fetch';
import Micro from '@microjs/microjs';

const host = '127.0.0.1';
const port = 8000;
const listen = { host, port };
const prefix = '/act';
const micro = Micro({ listen });

micro
  .run()
  .then(() => {
    return fetch(`http://${ host }:${ port }${ prefix }`, {
        // Слушается только POST
        method : 'POST',
        // Content-Type обязательно application/json
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ cmd: 'ping' })
      })
  })
  // Распакуем результат - как того требует библиотека
  .then(response => response.json())
  // Выведем в лог
  .then(micro.log.info)
  // Остановим запущенное приложение
  .then(() => micro.end())
  .catch(micro.log.error)
```
