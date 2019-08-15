import log from 'sistemium-telegram/services/log';
import lo from 'lodash';
import { battleText, battleMessageDate } from '../lib/battles';
import { writeFile } from '../lib/fs';
import parser from '../parsers/ruBattle';

import Battle from '../models/Battle';

const { debug, error } = log('listener');

const { LOGS_PATH } = process.env;

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
    debug('ignore', JSON.stringify(update));
    return false;
  }

  const { last_message: { date } } = update;
  debug('battle:', date, text.length);

  try {
    if (LOGS_PATH) {
      await writeFile(`./${LOGS_PATH}/${date}.txt`, text);
    }
  } catch (e) {
    error(e);
    process.exit();
  }

  const parsed = parser(text, battleMessageDate(update));
  const key = { date: parsed.date };
  const $setOnInsert = lo.omit(parsed, Object.keys(key));

  const args = [
    key,
    {
      $setOnInsert,
      $set: { ts: new Date() },
    },
    { upsert: true, new: true, useFindAndModify: false },
  ];

  debug('saving:', key);

  return Battle.findOneAndUpdate(...args);

}
