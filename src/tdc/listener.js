import log from 'sistemium-telegram/services/log';
import lo from 'lodash';
import { battleText, battleMessageDate } from '../lib/battles';
import { writeFile } from '../lib/fs';
import parser from '../parsers/battle';
import * as ru from '../parsers/ruBattle';
import * as eu from '../parsers/euBattle';

import Battle from '../models/Battle';

const { debug, error } = log('listener');

const { LOGS_PATH } = process.env;

const chats = new Map([
  [-1001108112459, eu], // CW2
  [-1001369273162, ru], // CW3
]);

export default async function (update, tdc) {

  const { chat_id: chatId } = update;

  const settings = chats.get(chatId);

  if (!settings) {
    return false;
  }

  const text = battleText(update);

  if (!text) {
    debug('ignore', JSON.stringify(update));
    return false;
  }

  const { last_message: { date, id: messageId } } = update;
  debug('battle:', date, text.length);

  try {
    if (LOGS_PATH) {
      await writeFile(`./${LOGS_PATH}/${date}.txt`, text);
    }
  } catch (e) {
    error(e);
  }

  const parsed = parser(text, battleMessageDate(update), settings);
  const key = { date: parsed.date };
  const $setOnInsert = lo.omit(parsed, Object.keys(key));

  if (tdc) {
    try {
      const { url: reportLink } = await tdc.getMessageLink(messageId, chatId);
      debug('reportLink:', reportLink);
      $setOnInsert.reportLink = reportLink;
    } catch (e) {
      error('getMessageLink:', e);
    }
  }

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
