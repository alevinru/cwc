import { Client } from 'tdl';
import { TDLib } from 'tdl-tdlib-ffi';

import log from 'sistemium-telegram/services/log';

const { debug, error } = log('tdc');

export default class CWCTdc {

  constructor({ emitter, codeEvent }) {
    this.emitter = emitter;
    this.codeEvent = codeEvent;
    this.client = new Client(new TDLib(), {
      apiId: parseInt(process.env.API_ID, 0),
      apiHash: process.env.API_HASH,
      // skipOldUpdates: true,
      tdlibParameters: {
        use_message_database: false,
        use_secret_chats: false,
        system_language_code: 'en',
        application_version: '1.0',
        device_model: 'NodeJS',
        system_version: process.versions.node,
        enable_storage_optimizer: true,
      },
    });
  }

  destroy() {
    return this.client.destroy();
  }

  async init() {

    // this.emitter.on(this.codeEvent, code => debug('got code', code));

    await this.client.connect();
    await this.client.login(() => ({
      getPhoneNumber,
      getAuthCode: retry => this.getAuthCode(retry),
    }));

    this.client
      .on('error', err => {
        error('tdc-error', err);
      })
      .on('destroy', () => {
        debug('destroy event');
      });

  }

  getClient() {
    return this.client;
  }

  async getAuthCode(retry) {

    debug('getAuthCode', retry);

    if (retry) {
      throw new Error('Invalid auth code');
    }

    return new Promise(resolve => {
      this.emitter.once(this.codeEvent, resolve);
    });

  }

  async getMessageLink(messageId, chatId) {
    return this.client.invoke({
      _: 'getMessageLink',
      chat_id: chatId,
      message_id: messageId,
    });
  }

}

async function getPhoneNumber(retry) {
  debug('getPhoneNumber', retry);
  if (retry) {
    throw new Error('Invalid phone number');
  }
  return process.env.PHONE_NUMBER;
}
