import lo from 'lodash';
import log from 'sistemium-telegram/services/log';
import * as battles from '../lib/battles';

const { error } = log('ruBattle');

const BATTLE_HOUR = 2;

const CASTLES = new Map([
  ['🐢Тортуги', 't'],
  ['☘️Оплота', 'o'],
  ['🌹Рассвета', 'r'],
  ['🍁Амбера', 'a'],
  ['🦇Ночи', 'n'],
  ['🖤Скалы', 's'],
  ['🍆Фермы', 'f'],
]);

const CASTLE_ICONS = ['🐢', '☘️', '🌹', '🍁', '🦇', '🖤', '🍆'];

const DIFF_MAP = new Map([
  ['скучали, на них никто не напал', null],
  ['легко отбились', 0],
  ['значительным преимуществом', 0],
  ['успешно атаковали', 1],
  ['успешно отбились', 1],
  ['силы были почти равны', 2],
  ['настоящая бойня', 2],
]);

const MAINLINE_RE = /(🔱)?(🛡|⚔) ([^\n]+)/;
const ATK_LINE_RE = /🎖Лидеры атаки: ([^\n]+)/;
const DEF_LINE_RE = /🎖Лидеры защиты: ([^\n]+)/;
const GOLD_LINE_RE = /🏆(У атакующих|Атакующие).+ (\d+) золотых монет/;
const STOCK_LINE_RE = /🏆(У атакующих|Атакующие).+ (\d+) складских ячеек/;

const POINTS_START_RE = /По итогам сражений замкам начислено/;

export default function (text, reportDate) {

  const parts = text.split('\n\n');
  const results = [];
  const pointsText = lo.find(parts, p => POINTS_START_RE.test(p));
  const scores = scoresHash(pointsText || '');

  CASTLES.forEach((code, key) => {

    const part = lo.find(parts, partText => {
      return partText.match(RegExp(`(у ворот|Защитники) ${key}`));
    });

    if (!part) {
      return;
    }

    const [, gaIcon, statusIcon, resLine] = part.match(MAINLINE_RE) || [];
    const [, atkLine] = part.match(ATK_LINE_RE) || [];
    const [, defLine] = part.match(DEF_LINE_RE) || [];
    const [, goldType, goldText] = part.match(GOLD_LINE_RE) || [];
    const [, , stockText] = part.match(STOCK_LINE_RE) || [];

    if (!resLine) {
      error(code, text);
      throw Error('Not matched battle mainline');
    }

    const castle = key.match(/[^а-я]+/i)[0];

    results.push({
      castle,
      code,
      result: battleResult(statusIcon),
      difficulty: battleDifficulty(resLine),
      ga: !!gaIcon,
      gold: battleGold(goldType, goldText),
      stock: battleGold(goldType, stockText),
      score: scores[castle],
      atkLeaders: battleLeaders(lo.trim(atkLine)),
      defLeaders: battleLeaders(lo.trim(defLine)),
    });

  });

  return {
    reportDate,
    date: battles.battleDate(reportDate, BATTLE_HOUR),
    results,
    text,
  };

}

function scoresHash(text) {

  return lo.mapValues(lo.keyBy(CASTLE_ICONS), castle => {
    const re = RegExp(`${castle}.+ [+](\\d+) 🏆 очков`);
    const [, points] = text.match(re) || [];
    return parseInt(points, 0) || 0;
  });

}

function battleLeaders(text) {
  if (!text) {
    return [];
  }
  return text.split(RegExp(` (?=${CASTLE_ICONS.join('|')})`))
    .map(name => name.replace(/🎗/, ''));
}

function battleGold(type, text) {
  if (!text) {
    return 0;
  }
  return parseInt(text, 0) * (type === 'Атакующие' ? -1 : 1);
}

function battleResult(icon) {
  switch (icon) {
    case '⚔':
      return 'breached';
    case '🔱🛡':
    case '🛡':
      return 'protected';
    default:
      throw Error(`Unexpected battleResult icon ${icon}`);
  }
}

function battleDifficulty(text) {
  const found = lo.find(Array.from(DIFF_MAP.keys()), key => text.match(RegExp(key)));
  if (!found) {
    error('battleDifficulty', text);
    throw Error('Not found battle difficulty');
  }
  return found ? DIFF_MAP.get(found) : null;
}
