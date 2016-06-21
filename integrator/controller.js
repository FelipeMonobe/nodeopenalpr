'use strict';

// CONSTANTS
const FS = require('fs'),
  SPAWN = require('child_process').spawn;

// MODULE DEFINITION
module.exports = () => {
  const CONTROLLER = {
    ping: ping,
    processImage: processImage
  };

  function ping(req, res) {
    return res.send('Pong!');
  }

  function processImage(req, res) {
    execute(req.body.image)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(err));
  }

  return CONTROLLER;
};

// AUXILIARY FUNCTIONS
function execute(b64) {
  let filename = `${new Date().getTime()}.jpg`;

  return saveImage(filename, b64)
    .then(() => ocrImage(filename))
    .then((ocr) => removeImage(filename, ocr));
}

function ocrImage(filename) {
  return new Promise((resolve, reject) => {
    let alpr = SPAWN('alpr', ['-c', 'gb', filename]),
      grep = SPAWN('grep', ['-o', '-m5', '[A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9]']);

    alpr.stdout.on('data', (data) => {
      grep.stdin.write(data);
    });

    alpr.stderr.on('data', (data) => {
      console.log(`OCR error: ${data}`);
      reject(data);
    });

    alpr.on('close', (code) => {
      if (code !== 0) console.log(`alpr process exited with code ${code}`);
      grep.stdin.end();
    });

    grep.stdout.on('data', (data) => {
      console.log(`file '${filename}' read`);
      resolve(data);
    });

    grep.stderr.on('data', (data) => {
      console.log(`grep error: ${data}`);
      reject(data);
    });

    grep.on('close', (code) => {
      if (code !== 0) console.log(`grep process exited with code ${code}`);
    });
  });
}

function removeImage(filename, ocr) {
  return new Promise((resolve, reject) => {
    FS.unlink(filename, (err) => {
      if (err) reject(err);
      console.log(`file '${filename}' removed\n`);
      resolve(ocr);
    });
  });
}

function saveImage(filename, b64) {
  return new Promise((resolve, reject) => {
    FS.writeFile(filename, b64, 'base64', (err) => {
      if (err) reject(err);

      console.log(`file '${filename}' saved`);
      resolve();
    });
  });
}
