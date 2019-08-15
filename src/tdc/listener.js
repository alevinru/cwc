import log from 'sistemium-telegram/services/log';
import lo from 'lodash';
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

  return Battle.findOneAndUpdate(...args);

}