import log from 'sistemium-telegram/services/log';
import { battleText } from '../lib/battles';
import { writeFile } from '../lib/fs';

const { debug, error } = log('listener');

const chats = [
  // -1001108112459, // CW2
  -1001369273162, // CW3
];

export default async function (update) {

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

}
