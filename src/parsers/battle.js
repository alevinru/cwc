import lo from 'lodash';
import log from 'sistemium-telegram/services/log';
import * as battles from '../lib/battles';

const { error } = log('parsers:battle');

const MAINLINE_RE = /(🔱)?(🛡|⚔) ([^\n]+)/;

export default function (text, reportDate, settings) {

  const {
    CASTLES,
    POINTS_START_RE,
    ATK_LINE_RE,
    DEF_LINE_RE,
    GOLD_LINE_RE,
    STOCK_LINE_RE,
    BATTLE_HOUR,
    CASTLE_ICONS,
    DIFF_MAP,
    ATTACKERS,
    GATES_DEFENDERS,
    POINTS,
  } = settings;

  const parts = text.split('\n\n');
  const results = [];
  const pointsText = lo.find(parts, p => POINTS_START_RE.test(p));
  const scores = scoresHash(pointsText || '');

  CASTLES.forEach((code, key) => {

    const part = lo.find(parts, partText => {
      return partText.match(RegExp(`(${GATES_DEFENDERS}) ${key}`));
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

    const castle = key.match(/[^а-яa-z]+/i)[0];

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

  function scoresHash(txt) {

    return lo.mapValues(lo.keyBy(CASTLE_ICONS), castle => {
      const re = RegExp(`${castle}.+ [+](\\d+) 🏆 ${POINTS}`);
      const [, points] = txt.match(re) || [];
      return parseInt(points, 0) || 0;
    });

  }

  function battleLeaders(txt) {
    if (!txt) {
      return [];
    }
    return txt.split(RegExp(` (?=${CASTLE_ICONS.join('|')})`))
      .map(name => name.replace(/🎗/, ''));
  }

  function battleDifficulty(txt) {
    const found = lo.find(Array.from(DIFF_MAP.keys()), key => txt.match(RegExp(key)));
    if (!found) {
      error('battleDifficulty', txt);
      throw Error('Not found battle difficulty');
    }
    return found ? DIFF_MAP.get(found) : null;
  }

  function battleGold(type, txt) {
    if (!txt) {
      return 0;
    }
    return parseInt(txt, 0) * (type === ATTACKERS ? -1 : 1);
  }

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
