import log from 'sistemium-telegram/services/log';

import emitter, { GOT_CODE } from './api';
import CWCTdc from './lib/CWCTdc';
import { writeFile } from './lib/fs';

const { debug, error } = log('index');

const chats = [
  // -1001108112459, // CW2
  -1001369273162, // CW3
];

const tdc = new CWCTdc({ emitter, codeEvent: GOT_CODE });

tdc.client()
  .on('update', update => {
    const { chat_id: chatId } = update;
    if (!chats.includes(chatId)) {
      return;
    }
    debug('update:', JSON.stringify(update));
  });

main().catch(error);

async function main() {

  emitter.on(GOT_CODE, code => debug('got code', code));

  await tdc.init();

}
