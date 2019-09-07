import log from 'sistemium-telegram/services/log';

import emitter, { GOT_CODE } from './api';
import CWCTdc from './lib/CWCTdc';
import listener from './tdc/listener';

const { debug, error } = log('index');

main().catch(error);

async function main() {

  const tdc = new CWCTdc({ emitter, codeEvent: GOT_CODE });
  const client = tdc.getClient();

  client.on('update', update => listener(update, tdc));

  emitter.on(GOT_CODE, code => debug('got code', code));

  process.on('SIGTERM', async () => {
    client.destroy();
  });

  await tdc.init();

}
