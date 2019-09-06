import { addHours, format } from 'date-fns';
import lo from 'lodash';

const IS_BATTLE_RE = /Результаты сражений|Battle reports/;

export function battleDate(reportDate, BATTLE_HOUR) {

  const date = addHours(reportDate, BATTLE_HOUR);
  const hours = Math.floor(date.getUTCHours() / 8) * 8;

  date.setUTCHours(hours);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setMilliseconds(0);

  return date;

}

export function battleText(message) {
  const text = lo.get(message, 'last_message.content.text.text');
  return IS_BATTLE_RE.test(text) && text;
}

export function battleMessageDate(message) {
  const date = lo.get(message, 'last_message.date');
  return new Date(date * 1000);
}

export function dateFormat(date) {
  return `${battleIcon(date)} ${dayPart(date)}`;
}

export function dayPart(date) {
  return format(date, 'DD/MM');
}

export function battleIcon(date) {
  const num = date.getUTCHours() / 8;
  return ['🌚', '🌝', '🌞'][num];
}
