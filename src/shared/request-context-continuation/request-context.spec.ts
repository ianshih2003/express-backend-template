import * as supertest from 'supertest';
import * as express from 'express';
import { Request } from 'express';

import { createContinuationContext, requestContext } from './request-context';
import { BffContextResolverMiddleware } from '../context-resolver';
import { bffRequestIdentifier } from '../request-identifier';
import { BFFContextData } from '../context-resolver';
import { ClientAppNameReader } from './request-meta/sources/app-name';
import { UserIdResolverInstance } from './request-meta/sources/user-id';

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
      .set('x-justo-requestid', 'my-request-id')
      .expect(200)
      .then(res => {
        expect(res.body).toBe('my-request-id');
        done();
      });
  });

  it('should return the meta data from the request', done => {
    supertest(app)
      .get('/info/meta')
      .set('Accept', 'application/json')
      .set('android-app', '1.0.0')
      .set('X-justo-RequestId', 'my-request-id')
      .set('X-justo-random', 'random')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          'X-justo-RequestId': 'my-request-id',
          'X-SessionId': 'sample-session-id',
          'X-justo-appClient': 'android',
          'X-justo-appVersion': '1.0.0',
          'X-justo-random': 'random'
        });
        done();
      });
  });

  it('should not loose the contxt in async/await code through the request', done => {
    supertest(app)
      .get('/async')
      .set('Accept', 'application/json')
      .set('android-app', '1.0.0')
      .set('X-justo-RequestId', 'my-request-id')
      .set('X-justo-random', 'random')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          tid: 'my-request-id',
          meta: {
            'X-justo-RequestId': 'my-request-id',
            'X-SessionId': 'sample-session-id',
            'X-justo-appClient': 'android',
            'X-justo-appVersion': '1.0.0',
            'X-justo-random': 'random'
          },
        });
        done();
      });
  });
});

