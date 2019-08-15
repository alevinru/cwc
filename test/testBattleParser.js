import ruBattle from '../src/parsers/ruBattle';
import { expect } from 'chai';
import { readFile } from '../src/lib/fs';
import { battleText, battleMessageDate, dateFormat } from '../src/lib/battles';

describe('Battle results parser', function () {

  it('should parse message text', async function () {

    const battleJson = await readFile('static/ruBattle.json');
    const msg = JSON.parse(battleJson);
    const msgDate = battleMessageDate(msg);
    const { results, date } = ruBattle(battleText(msg), msgDate);

    expect(results.length).equal(7);

    expect(dateFormat(date)).equal('🌞 13/08');

    expect(results[0]).to.eql({
      castle: '🐢',
      code: 't',
      difficulty: 0,
      ga: false,
      gold: 13,
      stock: 0,
      result: 'protected',
      atkLeaders: ['🍆Mathew', '🖤[NL]tahir_go'],
      defLeaders: [
        '🐢[TEA]Аргест ТС3О',
        '🐢[RUМ]Alkin',
        '🐢[BBS]MiniSatana',
        '🐢[PYN]Голос свыше',
      ],
      score: 64,
    });

    expect(results[1]).to.eql({
      castle: '☘️',
      code: 'o',
      difficulty: 1,
      ga: false,
      gold: -9891,
      stock: -14706,
      result: 'breached',
      atkLeaders: [
        '🐢[13G]BorovkovEA',
        '🐢[WCH]Хранитель котят',
        '🐢[НШ]eto je val',
        '🐢[OCE]Atomic',
      ],
      defLeaders: [
        '☘️[НОЖ]Хранитель Оплота',
        '☘️[НОЖ]В ПЕЧЕНЬ',
        '☘️[TWR]pchelka',
        '☘️[НОЖ]Щит Оплота',
      ],
      score: 4,
    });

    // Bored defenders
    expect(results[2].difficulty).equal(null);

  });

  it('should parse partial', async function () {

    const gaBattle = await readFile('static/ruGA.txt');
    const { results } = ruBattle(gaBattle.toString());

    expect(results[0]).to.eql({
      castle: '🍁',
      code: 'a',
      difficulty: 2,
      ga: true,
      gold: 3308,
      stock: 0,
      result: 'protected',
      atkLeaders: [
        '🖤[SS]🎗AndreGod',
        '☘️[OWL]Kaffka',
        '🖤[KSS]all4u',
        '🦇[TNT]Flame4',
      ],
      defLeaders: [
        '🍁[РЖД]Grozoth',
        '🍁[7DS]mIRA',
        '🍁[YLT]Fortunate son',
        '🍁[AT]Злобный Кроля',
      ],
      score: 0,
    });

  });

  it('should detect massacre', async function () {

    const massacreBattle = await readFile('static/ruMassacre.txt');
    const { results } = ruBattle(massacreBattle.toString());

    expect(results[6].difficulty).to.eql(2);

  });

});