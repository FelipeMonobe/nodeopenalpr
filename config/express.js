'use strict';

// CONSTANTS
const EXPRESS = require('express'),
  API = EXPRESS(),
  BODY_PARSER = require('body-parser'),
  CONSIGN = require('consign');

// MODULE DEFINITION
module.exports = () => {

  // MIDDLEWARES
  API.use(BODY_PARSER.json({
    limit: '6mb'
  }));

  API.use(BODY_PARSER.urlencoded({
    extended: false
  }));

  API.all('*', (req, res, next) => {
    console.log(`[${req.ip}] ${req.method} ${req.path}`);
    next();
  });

  CONSIGN()
    .include('integrator')
    .into(API);

  return API;
};
