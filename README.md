# Приложение обертка для запуска микросервисов
* **Source**: [Git](https://gitlab.com/microjs/microjs.git)
* **Language**: JavaScript
* **Engine**: [Node.js v6.5.0](https://nodejs.org/dist/latest-v6.x/)

Пример использования:

```javascript
import Micro from './index';
const options = {};

const micro = Micro(options)
    .add('cmd:one, id:*', ({ id }) => micro => {
        return micro.client('test-client')
                    .exec(`role:@macronomica/microservice-country, cmd:ping`)
                    .then(
                       country => country,
                       error => error
                    )
    })
    .client({
      name: 'test-client',
      host: '127.0.0.1',
      port: 8000,
      type: 'http'
    })
    .listen({
      host: '127.0.0.1',
      port: 8001,
      type: 'http'
    });
  
micro.act('cmd:one, id:*', (err, result) => micro => {
    micro.logger.silly('Результат выполнения', err);
})

```
