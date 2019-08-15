import log from 'sistemium-telegram/services/log';

import emitter, { GOT_CODE } from './api';
import CWCTdc from './lib/CWCTdc';
import { writeFile } from './lib/fs';
import { battleText } from './parsers/ruBattle';

const { debug, error } = log('index');

const chats = [
  // -1001108112459, // CW2
  -1001369273162, // CW3
];

const tdc = new CWCTdc({ emitter, codeEvent: GOT_CODE });

tdc.getClient()
  .on('update', async update => {
    const { chat_id: chatId } = update;
    if (!chats.includes(chatId)) {
      return;
    }
    const text = battleText(update);
    if (!text) {
      return;
    }
    const { last_message: { date } } = update;
    debug('battle:', date, text.length);
    try {
      await writeFile(`./logs/battles/${date}.txt`, text);
    } catch (e) {
      error(e);
      process.exit();
    }
  });

main().catch(error);

async function main() {

  emitter.on(GOT_CODE, code => debug('got code', code));

  await tdc.init();

}
