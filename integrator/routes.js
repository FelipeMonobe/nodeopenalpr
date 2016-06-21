'use strict';

// MODULE DEFINITION
module.exports = (API) => {
  // CONSTANTS
  const CONTROLLER = API.integrator.controller;

  // GETs
  API.get('/integrator/ping', CONTROLLER.ping);

  // POSTs
  API.post('/integrator/processImage', CONTROLLER.processImage);
};
