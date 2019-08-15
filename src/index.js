import log from 'sistemium-telegram/services/log';

import emitter, { GOT_CODE } from './api';
import CWCTdc from './lib/CWCTdc';
import listener from './tdc/listener';

const { debug, error } = log('index');

main().catch(error);

async function main() {

  const tdc = new CWCTdc({ emitter, codeEvent: GOT_CODE });

  tdc.getClient()
    .on('update', listener);

  emitter.on(GOT_CODE, code => debug('got code', code));

  await tdc.init();

}
