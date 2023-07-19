import * as express from 'express';
import { Application } from 'express';
import { bffRequestIdentifier } from './request-identifier.middleware';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

const responseHandler = (req: express.Request, res: express.Response) => {
  res.json({ id: (req as any).id });
};

describe('request identifier middleware', () => {
  it('should assign an id for the request', (done) => {
    const app: Application = express();
    app.use(bffRequestIdentifier());
    app.get('/', responseHandler);
    supertest(app)
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        done();
      });
  });

  it('should forward an id for the request', (done) => {
    const id = v4();

    const app: Application = express();
    app.use(bffRequestIdentifier());
    app.get('/', responseHandler);
    supertest(app)
      .get('/')
      .set('X-justo-Requestid', id)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(id);
        done();
      });
  });
});
