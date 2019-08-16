# ChatWars battle reporter

Upon logon the service listens to the battle report channel and saves normalized data to mongodb.

Currenlty supports only CW3.

## Setup

Use [TDLib build instructions generator](https://tdlib.github.io/td/build.html) to build Telegram binaries.

### Required variables:

- API_HASH
- API_ID
- MONGO_URL
- PHONE_NUMBER

### Optional

- LOGS_PATH
- REST_PORT (default 9922)

API_HASH and API_ID could be obtained at https://my.telegram.org/
