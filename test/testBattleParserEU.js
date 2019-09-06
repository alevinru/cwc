import * as euConst from '../src/parsers/euBattle';
import parser from '../src/parsers/battle';
import { expect } from 'chai';
import { readFile } from '../src/lib/fs';
import { battleText, battleMessageDate, dateFormat } from '../src/lib/battles';


describe('Battle EU results parser', function () {

  it('should parse message text', async function () {

    const battleJson = await readFile('static/euBattle.json');
    const msg = JSON.parse(battleJson);
    const msgDate = battleMessageDate(msg);
    const { results, date } = parser(battleText(msg), msgDate, euConst);

    expect(results.length).equal(7);

    expect(dateFormat(date)).equal('🌝 13/08');

    expect(results[0]).to.eql({
      castle: '🦅',
      code: 'h',
      difficulty: 0,
      ga: false,
      gold: -11506,
      stock: -14239,
      result: 'breached',
      atkLeaders: [
        '🌑[BS]Swamp Koala lv65',
        '🌑[ALC]oholic',
        '🐺[BAN]Guardsmen',
        '🌑[NOT]aShark',
      ],
      defLeaders: [
        '🦅[ORD]Kaizen',
        '🦅[CHS]Ray915',
        '🦅[ORD]Zeldris',
        '🦅[BYE]liebesleid',
      ],
      score: 4,
    });

    expect(results[1]).to.eql({
      castle: '🐺',
      code: 'w',
      difficulty: 0,
      ga: false,
      gold: 28,
      stock: 0,
      result: 'protected',
      atkLeaders: [
        '🦅Isael',
        '🦅Keithtwb',
        '🥔David',
        '🦌D4NKS0N',
      ],
      defLeaders: [
        '🐺GeorgeTheMiner',
        '🐺[PAW]Der_Horst',
        '🐺Lord Daken',
        '🐺[FTW]Politox',
      ],
      score: 25,
    });

    // massacre
    expect(results[6].difficulty).equal(2);

  });

  it('should parse text file', async function () {
    const battleText = await readFile('static/euBored.txt');
    const { results } = parser(battleText.toString(), '', euConst);

    expect(results.length).to.eql(7);

    expect(results[1].difficulty).to.eql(0);
    expect(results[2].difficulty).to.eql(null);
    expect(results[3].difficulty).to.eql(1);

  });

});
