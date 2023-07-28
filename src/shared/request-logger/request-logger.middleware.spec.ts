import express from 'express';
import { Application } from 'express';
import { BunyanMiddleware } from '../bunyan-middleware';
import supertest from 'supertest';
import bunyan from 'bunyan';
import { bffRequestLoggerMiddleware } from './request-logger-middleware';

const msg: string = 'msg';

const responseHandler = (req: express.Request, res: express.Response) => {
  res.json({ id: (req as any).id });
};

const ringbuffer = new bunyan.RingBuffer({ limit: 100 });
const mockedBunyan: bunyan = bunyan.createLogger({
  name: 'testing',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'info',
      type: 'raw', // use 'raw' to get raw log record objects
      stream: ringbuffer,
    },
  ],
});

describe('request logger middleware', () => {
  it('should have an start log for a request', (done) => {
    ringbuffer.records = [];
    const app: Application = express();
    app.use(BunyanMiddleware(mockedBunyan));
    app.use(bffRequestLoggerMiddleware());
    app.get('/', responseHandler);
    supertest(app)
      .get('/')
      .expect(200)
      .then(() => {
        expect(ringbuffer.records).toBeDefined();
        expect(ringbuffer.records.length).toBeGreaterThanOrEqual(2);
        expect(ringbuffer.records[0][msg]).toBe('[START]');
        done();
      });
  });

  it('should take in count configuration', (done) => {
    ringbuffer.records = [];
    const app: Application = express();
    app.use(BunyanMiddleware(mockedBunyan));
    app.use(
      bffRequestLoggerMiddleware({
        messages: {
          beforeMessage: 'b4',
          afterMessage: 'after',
        },
      }),
    );
    app.get('/', responseHandler);
    supertest(app)
      .get('/')
      .expect(200)
      .then(() => {
        expect(ringbuffer.records).toBeDefined();
        expect(ringbuffer.records.length).toBe(2);
        expect(ringbuffer.records[0][msg]).toBe('b4');
        expect(ringbuffer.records[1][msg]).toBe('after');
        done();
      });
  });

  it('should ignore ignored endpoints', (done) => {
    ringbuffer.records = [];
    const app: Application = express();
    app.use(BunyanMiddleware(mockedBunyan));
    app.use(
      bffRequestLoggerMiddleware({
        excludeRequestUri: ['/health'],
      }),
    );
    app.get('/health', responseHandler);
    supertest(app)
      .get('/health')
      .expect(200)
      .then(() => {
        expect(ringbuffer.records).toBeDefined();
        expect(ringbuffer.records.length).toBe(0);
        done();
      });
  });

  it('should include/exclude including if its in both', (done) => {
    ringbuffer.records = [];
    const app: Application = express();
    app.use(BunyanMiddleware(mockedBunyan));
    app.use(
      bffRequestLoggerMiddleware({
        excludeRequestUri: ['/health'],
        includeRequestUri: ['/health'],
      }),
    );
    app.get('/health', responseHandler);
    supertest(app)
      .get('/health')
      .expect(200)
      .then(() => {
        expect(ringbuffer.records).toBeDefined();
        expect(ringbuffer.records.length).toBe(2);
        expect(ringbuffer.records[0][msg]).toBe('[START]');
        done();
      });
  });

  it('should consider starting url of the request', (done) => {
    ringbuffer.records = [];
    const app: Application = express();
    app.use(BunyanMiddleware(mockedBunyan));
    app.use(
      bffRequestLoggerMiddleware({
        excludeRequestUri: ['/health'],
      }),
    );
    app.get('/health/somethingelse', responseHandler);
    supertest(app)
      .get('/health/somethingelse')
      .expect(200)
      .then(() => {
        expect(ringbuffer.records).toBeDefined();
        expect(ringbuffer.records.length).toBe(0);
        done();
      });
  });

  it('should consider only included url', (done) => {
    const app: Application = express();
    app.use(BunyanMiddleware(mockedBunyan));
    app.use(
      bffRequestLoggerMiddleware({
        includeRequestUri: ['/health'],
      }),
    );
    app.get('/somethingelse', responseHandler);
    supertest(app)
      .get('/somethingelse')
      .expect(200)
      .then(() => {
        expect(ringbuffer.records).toBeDefined();
        expect(ringbuffer.records.length).toBe(0);
        done();
      });
  });
});
