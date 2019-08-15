import lo from 'lodash';
import log from 'sistemium-telegram/services/log';

const { error } = log('ruBattle');

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

const IS_BATTLE_RE = /Результаты сражений/;

const MAINLINE_RE = /(🔱)?(🛡|⚔) ([^\n]+)/;
const ATK_LINE_RE = /🎖Лидеры атаки: ([^\n]+)/;
const DEF_LINE_RE = /🎖Лидеры защиты: ([^\n]+)/;
const GOLD_LINE_RE = /🏆(У атакующих|Атакующие).+ (\d+) золотых монет/;
const STOCK_LINE_RE = /🏆(У атакующих|Атакующие).+ (\d+) складских ячеек/;

const POINTS_START_RE = /По итогам сражений замкам начислено/;

export default function (text) {

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
    results,
    text,
  };

}

export function battleText(message) {
  const text = lo.get(message, 'last_message.content.text.text');
  return IS_BATTLE_RE.test(text) && text;
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
  return text.split(RegExp(` (?=${CASTLE_ICONS.join('|')})`));
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

/*
14 Lenzin 1064
Результаты сражений:
🛡 В битве у ворот 🐢Тортуги защитники легко отбились от жалкой горстки воинов 🍆Фермы.
🎖Лидеры атаки: 🍆Mathew 🖤[NL]tahir_go
🎖Лидеры защиты: 🐢[TEA]Аргест ТС3О 🐢[RUМ]Alkin 🐢[BBS]MiniSatana 🐢[PYN]Голос свыше
🏆У атакующих отобрали 13 золотых монет.

⚔️ В битве у ворот ☘️Оплота воины  🖤Скалы 🐢Тортуги 🦇Ночи 🌹Рассвета 🍆Фермы
    успешно атаковали защитников.
🎖Лидеры атаки: 🐢[13G]BorovkovEA 🐢[WCH]Хранитель котят 🐢[НШ]eto je val 🐢[OCE]Atomic
🎖Лидеры защиты: ☘️[НОЖ]Хранитель Оплота ☘️[НОЖ]В ПЕЧЕНЬ ☘️[TWR]pchelka ☘️[НОЖ]Щит Оплота
🏆Атакующие разграбили замок на 9891 золотых монет, потеряно 14706 складских ячеек.

🛡 Защитники 🌹Рассвета скучали, на них никто не напал.

🛡 В битве у ворот 🍁Амбера защитники легко отбились от жалкой горстки воинов
    🌹Рассвета,🍆Фермы &🖤Скалы.
🎖Лидеры атаки: 🌹[LVT]OderRodion 🍆Canadian feller 🖤[KYS]SCIENTIST 🦇[ALC]Трунь
🎖Лидеры защиты: 🍁[7DS]mIRA 🍁[9KA]su4ara 9KA 🍁[YLT]Fortunate son 🍁[7DS]Acedia
🏆У атакующих отобрали 88 золотых монет.

⚔️ В битве у ворот 🦇Ночи воины  🐢Тортуги 🍆Фермы 🍁Амбера 🌹Рассвета ☘️Оплота
    успешно атаковали защитников.
🎖Лидеры атаки: 🐢[JR]Шататель Скалы 🐢[DTF]ArtemisEntrery 🍁[RZD]47th 🍆[TND]Разруливает
🎖Лидеры защиты: 🦇[DS]Sir Lancelot 🦇[NTR]Suworow 🦇[AFS]teffsy 🦇[DS]Crosby15
🏆Атакующие разграбили замок на 9676 золотых монет, потеряно 22307 складских ячеек.

🛡 В битве у ворот 🖤Скалы защитники легко отбились от жалкой горстки воинов
    🦇Ночи,🌹Рассвета &🍁Амбера.
🎖Лидеры атаки: 🍁[A1]Nihilias 🍁[WH]CruorVultTigeron 🦇Rock Master 🌹Invisigod
🎖Лидеры защиты: 🖤[TS]Poherantos 🖤[KVA]ДЕТОНАТОР 🖤[IRN]Sanktym 🖤[ARR]abubaca4
🏆У атакующих отобрали 191 золотых монет.

⚔️ В битве у ворот 🍆Фермы воины ☘️Оплота,🖤Скалы &🦇Ночи успешно атаковали защитников.
🎖Лидеры атаки: 🖤[SS]🎗AndreGod 🖤[NMR]Fishboss 🦇[TNT]Flame4 🖤[KSS]all4u
🎖Лидеры защиты: 🍆[MLT]pelmenka 🍆[ЕGG]IS A TRAP 🍆[ASS]Дядя Стёпа 🍆[2CH]голос овощей
🏆Атакующие разграбили замок на 10684 золотых монет, потеряно 17382 складских ячеек.

По итогам сражений замкам начислено:
🐢Тортуга +64 🏆 очков
🖤Скала +50 🏆 очков
🍁Амбер +26 🏆 очков
🌹Замок Рассвета +20 🏆 очков
🦇Ночной Замок +7 🏆 очков
☘️Оплот +4 🏆 очков
🍆Ферма +4 🏆 очков
 */

/*
🔱🛡 В битве у ворот 🍁Амбера силы были почти равны, но защитники героически отразили
    атаку воинов☘️Оплота,🦇Ночи &🖤Скалы.
🎖Лидеры атаки: 🖤[SS]🎗AndreGod ☘️[OWL]Kaffka 🖤[KSS]all4u 🦇[TNT]Flame4
🎖Лидеры защиты: 🍁[РЖД]Grozoth 🍁[7DS]mIRA 🍁[YLT]Fortunate son 🍁[AT]Злобный Кроля
🏆У атакующих отобрали 3308 золотых монет.

⚔️ В битве у ворот 🖤Скалы со значительным преимуществом воины 🌹Рассвета,🍆Фермы &🐢Тортуги
    успешно атаковали защитников.
🎖Лидеры атаки: 🐢[JR]Шататель Скалы 🐢[НШ]eto je val 🍆[TND]re_dragone 🍆[ELF]Serterro
🎖Лидеры защиты: 🖤[IRN]Sanktym 🖤[DPS]Apko 🖤[GOD]A I D 🖤[ASF]kentmentoll
🏆Атакующие разграбили замок на 10873 золотых монет, потеряно 21320 складских ячеек.

⚔️ В битве у ворот ☘️Оплота разыгралась настоящая бойня, но все-таки
    силы атакующих были чуть сильнее и 🌹Рассвета,🍆Фермы,🖤Скалы &🐢Тортуги победили.
🎖Лидеры атаки: 🐢[13G]StyuAtt 🖤[РОК]7ckingSad 🐢[OCE]Atomic 🖤[S2D]aLisa
🎖Лидеры защиты: ☘️[TWR]KovalskyII ☘️[КОД]еиновая Панда ☘️[VTG]silentbobb ☘️[DD]Dmytrukha
🏆Атакующие разграбили замок на 9567 золотых монет, потеряно 15520 складских ячеек.

🛡 Защитники 🐢Тортуги успешно отбились от воинов 🦇Ночи,☘️Оплота &🍁Амбера
🎖Лидеры атаки: ☘️[OWL]Kaffka 🦇[DS]DarthTonny 🦇[WTF]Mars RRW 🦇[TNT]Геральт из SOD
🎖Лидеры защиты: 🐢[НП]Dark Eagle 🐢[RW]Thanquol 🐢[LA]DA Dance 🐢[KOT]Letka
🏆У атакующих отобрали 13557 золотых монет.

 */
