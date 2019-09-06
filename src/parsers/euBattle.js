export const BATTLE_HOUR = 1;

export const CASTLES = new Map([
  ['🦅Highnest', 'h'],
  ['🐺Wolfpack', 'w'],
  ['🦌Deerhorn', 'de'],
  ['🦈Sharkteeth', 's'],
  ['🐉Dragonscale', 'dr'],
  ['🌑Moonlight', 'm'],
  ['🥔Potato', 'p'],
]);

export const CASTLE_ICONS = ['🦅', '🐺', '🦌', '🦈', '🐉', '🌑', '🥔'];

export const DIFF_MAP = new Map([
  ['Castle were bored - no one has attacked them', null],
  ['easily fought off', 0],
  ['wiped out by a horde', 0],
  ['successfully managed to break', 1],
  ['defenders have stood victorious', 1],
  ['the defenders had a slight edge over ', 2],
  ['was a bloody massacre', 2],
]);

export const POINTS = 'points';
export const GATES_DEFENDERS = 'Battle at|At|Defenders of';
export const ATTACKERS = 'have pillaged';
export const ATK_LINE_RE = /🎖Attack leaders: ([^\n]+)/;
export const DEF_LINE_RE = /🎖Defense leaders: ([^\n]+)/;
export const GOLD_LINE_RE = /🏆Attackers (have lost|have pillaged).* (\d+) gold/;
export const STOCK_LINE_RE = /🏆Attackers (have lost|have pillaged).* (\d+) stock/;

export const POINTS_START_RE = /Scores/;
