import { assert } from 'chai';
import CWCTdc from '../src/lib/CWCTdc';

describe('TDLib client', function () {

  it('should get sample message link', async function () {


    const tdc = new CWCTdc({});
    const client = tdc.getClient();
    assert(client);

    await tdc.init();

    const link = await new Promise((resolve, reject) => {
      client.on('update', ({ chat_id, last_message }) => {
        if (!chat_id || !last_message) {
          return;
        }
        tdc.getMessageLink(last_message.id, chat_id)
          .then(resolve, reject);
      });
    });

    console.info(link);
    assert(link, 'Link should be not empty');

  });

  after(async function () {
    // await tdc.destroy()
  });

});