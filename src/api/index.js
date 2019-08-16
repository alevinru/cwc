import Koa from 'koa';
import Router from 'koa-router';
import log from 'sistemium-telegram/services/log';
import EventEmitter from 'events';

const { debug } = log('api');

const { REST_PORT = 9922 } = process.env;

const app = new Koa();
const api = new Router();

const emitter = new EventEmitter();

export default emitter;
export const GOT_CODE = 'GOT_CODE';

api.prefix('/api');

api.get('/code', async ctx => {
  const { query: { code } } = ctx;
  debug('code', `${code}`);
  emitter.emit(GOT_CODE, code);
  ctx.body = '';
});

app
  .use(api.routes())
  .use(api.allowedMethods())
  .listen(REST_PORT);

debug('starting on port', REST_PORT);
