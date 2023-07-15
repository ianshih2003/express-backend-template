import axios from 'axios';
import * as express from 'express';
import * as supertest from 'supertest';

import { BffHttpAxiosClient } from './http-client';
import { createContinuationContext } from '../../request-context-continuation';
import { BffContextResolverMiddleware } from '../../context-resolver';

import nock = require('nock');

const FAKE_HOST = 'http://fakehost.ccs.com';

jest.mock('../../context-resolver/contexts/context-service');

class MyApiService {
  @BffHttpAxiosClient()
  private http = axios.create({ baseURL: FAKE_HOST });

  getAvailability() {
    return this.http.get('/character');
  }
}

const app = express();
app.use(BffContextResolverMiddleware());
app.use(createContinuationContext());

app.get('/availability', async function(_req, res) {
  try {
    const service = new MyApiService();
    const availabilityResponse = await service.getAvailability();

    return res.json({ headers: availabilityResponse.config.headers });
  } catch (err) {
    res.status(400);
  }
});

describe('http-client', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'staging';
  });

  it('specify response for a specific request', done => {
    nock('http://fakehost.ccs.com')
      .get(/^\/character.*/)
      .reply(200, {
        id: 12345,
        firstName: 'Fred',
        lastName: 'Flintstone',
      });

    supertest(app)
      .get('/availability')
      .set('Accept', 'application/json')
      .set('Host', 'bar.ccs.com.ar')
      .set('X-ccs-RequestId', 'my-request-id')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          headers: {
            accept: 'application/json, text/plain, */*',
            'x-ccs-requestid': 'my-request-id',
            'x-ccs-clientappname': '@bff/core',
            'x-pushanalytics': 'true',
            'User-Agent': 'axios/0.19.2',
          },
        });
        done();
      });
  });
});
