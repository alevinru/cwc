export const BATTLE_HOUR = 2;

export const CASTLES = new Map([
  ['🐢Тортуги', 't'],
  ['☘️Оплота', 'o'],
  ['🌹Рассвета', 'r'],
  ['🍁Амбера', 'a'],
  ['🦇Ночи', 'n'],
  ['🖤Скалы', 's'],
  ['🍆Фермы', 'f'],
]);

export const CASTLE_ICONS = ['🐢', '☘️', '🌹', '🍁', '🦇', '🖤', '🍆'];

export const DIFF_MAP = new Map([
  ['скучали, на них никто не напал', null],
  ['легко отбились', 0],
  ['значительным преимуществом', 0],
  ['успешно атаковали', 1],
  ['успешно отбились', 1],
  ['силы были почти равны', 2],
  ['настоящая бойня', 2],
]);

export const POINTS = 'очков';
export const GATES_DEFENDERS = 'у ворот|Защитники';
export const ATTACKERS = 'Атакующие';
export const ATK_LINE_RE = /🎖Лидеры атаки: ([^\n]+)/;
export const DEF_LINE_RE = /🎖Лидеры защиты: ([^\n]+)/;
export const GOLD_LINE_RE = /🏆(У атакующих|Атакующие).+ (\d+) золотых монет/;
export const STOCK_LINE_RE = /🏆(У атакующих|Атакующие).+ (\d+) складских ячеек/;

export const POINTS_START_RE = /По итогам сражений замкам начислено/;
