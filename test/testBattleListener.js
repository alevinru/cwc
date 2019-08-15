import { expect, assert } from 'chai';
import * as mng from 'sistemium-mongo/lib/mongoose';
import { readFile } from '../src/lib/fs';
import listener from '../src/tdc/listener';

before(async function() {
  assert(process.env.MONGO_URL, 'Must be set MONGO_URL variable');
  await mng.connect();
});

describe('Battle listener', function () {

  it('should save to mongo', async function () {

    const battleJson = await readFile('static/ruBattle.json');
    const created = await listener(JSON.parse(battleJson));
    assert(created, 'Saved battle should be not empty');

  });

});

after(async function() {
  await mng.disconnect();
});