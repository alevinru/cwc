import ruBattle from '../src/parsers/ruBattle';
import chai from 'chai';
import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);

describe('Battle results parser', function () {

  it('should parse message text', async function () {

    const battleJson = await readFile('static/ruBattle.json');
    const battlePost = JSON.parse(battleJson);
    const { results } = ruBattle(battlePost.last_message.content.text.text);

    chai.expect(results.length).equal(7);

    chai.expect(results[0]).to.eql({
      castle: '🐢',
      code: 't',
      difficulty: 0,
      ga: false,
      gold: 13,
      stock: 0,
      result: 'protected',
      atkLeaders: [],
      defLeaders: [],
      score: 0,
    });

    chai.expect(results[1]).to.eql({
      castle: '☘️',
      code: 'o',
      difficulty: 1,
      ga: false,
      gold: -9891,
      stock: -14706,
      result: 'breached',
      atkLeaders: [],
      defLeaders: [],
      score: 0,
    });

    // Bored defenders
    chai.expect(results[2].difficulty).equal(null);

  });

  it('should parse partial', async function () {

    const gaBattle = await readFile('static/ruGA.txt');
    const { results } = ruBattle(gaBattle.toString());

    chai.expect(results[0]).to.eql({
      castle: '🍁',
      code: 'a',
      difficulty: 2,
      ga: true,
      gold: 3308,
      stock: 0,
      result: 'protected',
      atkLeaders: [],
      defLeaders: [],
      score: 0,
    });

  });

});