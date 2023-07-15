import express = require('express');

export function listEndpoints(expressApp: express.Application) {
  console.log();
  console.log('********** API **********');
  expressApp._router.stack.forEach((r: any) => {
    if (r.route && r.route.path){
      console.log(r.route.path)
    }
  })
  console.log();
}
