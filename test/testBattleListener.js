import { assert } from 'chai';
import { readFile } from '../src/lib/fs';
import listener from '../src/tdc/listener';


describe('Battle listener', function () {

  assert(process.env.MONGO_URL_RU, 'Must be set MONGO_URL_RU variable');

  it('should save to mongo', async function () {

    const battleJson = await readFile('static/ruBattle.json');
    const created = await listener(JSON.parse(battleJson));
    assert(created, 'Saved battle should be not empty');

  });

});
