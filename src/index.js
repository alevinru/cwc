import log from 'sistemium-telegram/services/log';
import * as mng from 'sistemium-mongo/lib/mongoose';

import emitter, { GOT_CODE } from './api';
import CWCTdc from './lib/CWCTdc';
import listener from './tdc/listener';

const { debug, error } = log('index');

main().catch(error);

async function main() {

  await mng.connect();
  const tdc = new CWCTdc({ emitter, codeEvent: GOT_CODE });
  const client = tdc.getClient();

  client.on('update', listener);

  emitter.on(GOT_CODE, code => debug('got code', code));

  process.on('SIGTERM', async () => {
    await mng.disconnect();
    client.destroy();
  });

  await tdc.init();

}
