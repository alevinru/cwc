import log from 'sistemium-telegram/services/log';
import { Client } from 'tdl';
import { TDLib } from 'tdl-tdlib-ffi';

import emitter, { GOT_CODE } from './api';

const { debug, error } = log('index');

const client = new Client(new TDLib(), {
  apiId: parseInt(process.env.API_ID, 0),
  apiHash: process.env.API_HASH,
  skipOldUpdates: true,
  tdlibParameters: {
    use_message_database: true,
    use_secret_chats: false,
    system_language_code: 'en',
    application_version: '1.0',
    device_model: 'NodeJS',
    system_version: process.versions.node,
    enable_storage_optimizer: true,
  },
});

client
  .on('update', update => {
    debug('update:', JSON.stringify(update));
  })
  .on('error', err => {
    error(JSON.stringify(err, null, 2));
  })
  .on('destroy', () => {
    debug('destroy event');
  });

async function main() {

  emitter.on(GOT_CODE, code => debug('got code', code));

  const loginDetails = {
    getPhoneNumber,
    getAuthCode,
    getPassword,
    getName: () => Promise.resolve({ firstName: 'John', lastName: 'Doe' }),
  };

  await client.connect();
  await client.login(() => loginDetails);

  debug(Object.keys(loginDetails));

}

main().catch(error);

async function getPhoneNumber(retry) {
  return retry ? new Error('Invalid phone number') : process.env.PHONE_NUMBER;
}

async function getAuthCode(retry) {

  debug('getAuthCode', retry);

  if (retry) {
    throw new Error('Invalid auth code');
  }

  return new Promise(resolve => {
    emitter.once(GOT_CODE, resolve);
  });

}

async function getPassword(passwordHint, retry) {
  return retry ? new Error('Invalid password') : 'abcdef';
}
