# Simple Trading application
Simple TCP socket trading application written using TypeScript and ESM with unit tests (jest) with logging. Trades are only in-memory stored, so after the server will be closed they will disappear - some database should be used. 
Tested on Windows and Linux.

## Installation
Run `npm install` in the main folder

## Starting
Run `npm start` to start the application (it will be compiled from TypeScript to JavaScript ES6 inside 'build' folder)

## Unit tests
Run `npm test`

## Linter (eslint)
Run `npm run lint`

## Connecting as client
Windows: Install ncat and run in cmd (multiple clients supported):
`ncat localhost 8888`

Linux run:
`nc localhost 8888`

## Supported commands
- `BUY:APPLE`
- `BUY:PEAR`
- `BUY:ONION`
- `BUY:TOMATO`
- `BUY:POTATO`
- `SELL:APPLE`
- `SELL:PEAR`
- `SELL:ONION`
- `SELL:TOMATO`
- `SELL:POTATO`

## Logging
Status is logged to the console and sent to clients + two log files (combined.log and error.log are created)
