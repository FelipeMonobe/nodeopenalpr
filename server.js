'use strict';

// CONSTANTS
const http = require('http'),
  API = require('./config/express')(),
  PORT = 8200,
  ADDRESS = '127.0.0.1';

// EXECUTION
http.createServer(API)
  .listen(PORT, ADDRESS, () => {
    console.log(`\nApplication up at http://${ADDRESS}:${PORT}\n`);
  });
