import express = require('express');
import * as expressListEndpoints from 'express-list-endpoints';

export function listEndpoints(expressApp: express.Express) {
  console.log();
  console.log('********** API **********');
  const endpoints = expressListEndpoints(expressApp)
    .map((endpoint: any) => `${endpoint.methods.join(',')} => ${endpoint.path}`)
    .forEach((endpoint: string) => console.log(endpoint));
  console.log();
}
