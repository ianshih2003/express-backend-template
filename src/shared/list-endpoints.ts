/* eslint-disable @typescript-eslint/no-explicit-any, no-console*/
import express = require('express');

export function listEndpoints(expressApp: express.Application) {
  console.log();
  console.log('********** API **********');
  expressApp._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      if (middleware.route.path) {
        console.log(middleware.route.path);
      }
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route.path) {
          console.log(handler.route.path);
        }
      });
    }
  });
  console.log();
}
