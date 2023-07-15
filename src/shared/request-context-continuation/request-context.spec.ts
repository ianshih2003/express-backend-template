import * as supertest from 'supertest';
import * as express from 'express';
import { Request } from 'express';

import { createContinuationContext, requestContext } from './request-context';
import { BffContextResolverMiddleware } from '../context-resolver';
import { bffRequestIdentifier } from '../request-identifier';
import { BFFContextData } from '../context-resolver';

jest.mock('../context-resolver/contexts/context-service');

describe('request context', () => {
  const app = express();

  async function asyncCode() {
    return requestContext.meta;
  }

  app.use((req, _, next) => {
    req.cookies = {
      '_ccs_session_id': 'sample-session-id',
      '_ccs_p13n': 'my-personalization-cookie',
    };
    next();
  });

  app.use(bffRequestIdentifier());
  app.use(BffContextResolverMiddleware());
  app.use(createContinuationContext());

  app.get('/info/:data', function(req: Request, res) {
    const resolutions: Record<string, any> = {
      tid: requestContext.tid,
      context: (req as any).context as BFFContextData,
      meta: requestContext.meta,
    };
    return res.json(resolutions[req.params.data]);
  });

  app.get('/async', async function(_, res) {
    const result = await asyncCode();
    return res.json({ tid: requestContext.tid, meta: result });
  });

  it('should return the TID from the request', done => {
    supertest(app)
      .get('/info/tid')
      .set('Host', 'bar.ccs.com.ar')
      .set('Accept', 'application/json')
      .set('x-ccs-requestid', 'my-request-id')
      .expect(200)
      .then(res => {
        expect(res.body).toBe('my-request-id');
        done();
      });
  });

  it('should return the context from the request', done => {
    supertest(app)
      .get('/info/context')
      .set('Host', 'bar.ccs.com.ar')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          company: 'ccs',
          channel: 'test',
          site: 'arg',
          currency: { code: 'ARS', description: '$' },
          language: 'es',
          locale: 'es-AR',
        });
        done();
      });
  });

  it('should return the meta data from the request', done => {
    supertest(app)
      .get('/info/meta')
      .set('Host', 'bar.ccs.com.ar')
      .set('Accept', 'application/json')
      .set('X-ccs-RequestId', 'my-request-id')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          'X-PushAnalytics': 'true',
          'X-ccs-P13N': 'my-personalization-cookie',
          'X-ccs-RequestId': 'my-request-id',
          'X-SessionId': 'sample-session-id',
          'X-ccs-ClientAppName': '@bff/core',
        });
        done();
      });
  });

  it('should not loose the contxt in async/await code through the request', done => {
    supertest(app)
      .get('/async')
      .set('Host', 'bar.ccs.com.ar')
      .set('Accept', 'application/json')
      .set('x-ccs-requestid', 'my-request-id')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          tid: 'my-request-id',
          meta: {
            'X-PushAnalytics': 'true',
            'X-ccs-P13N': 'my-personalization-cookie',
            'X-ccs-RequestId': 'my-request-id',
            'X-SessionId': 'sample-session-id',
            'X-ccs-ClientAppName': '@bff/core',
          },
        });
        done();
      });
  });
});

describe('empty request context', () => {
  const app = express();

  app.get('/info/meta', function(_, res) {
    try {
      res.json(requestContext.meta);
    } catch (err) {
      res.json({ error: err.message });
    }
  });

  it('should return an error when the the middleware is not created', done => {
    supertest(app)
      .get('/info/meta')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          error:
            'There is no continuation context created, call the createContinuationContext() middleware to create one',
        });
        done();
      });
  });
});
