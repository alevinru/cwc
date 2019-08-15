import log from 'sistemium-telegram/services/log';
import { battleText, battleMessageDate } from '../lib/battles';
import { writeFile } from '../lib/fs';
import parser from '../parsers/ruBattle';

import Battle from '../models/Battle';

const { debug, error } = log('listener');

const chats = [
  // -1001108112459, // CW2
  -1001369273162, // CW3
];

export default async function (update) {

  const { chat_id: chatId } = update;

  if (!chats.includes(chatId)) {
    return false;
  }

  const text = battleText(update);

  if (!text) {
    return false;
  }

  const { last_message: { date } } = update;
  debug('battle:', date, text.length);

  try {
    await writeFile(`./logs/battles/${date}.txt`, text);
  } catch (e) {
    error(e);
    process.exit();
  }

  try {
    const parsed = parser(text, battleMessageDate(update));
    const { date } = parsed;
    parsed.ts = new Date();
    const options = { upsert: true, returnNewDocument: true };
    return await Battle.findOneAndReplace({ date }, parsed, options);
  } catch (e) {
    error(e);
  }

  return false;

}
