import supertest from 'supertest';
import express from 'express';
import getRouter from './resources.router';
import { ResourceController } from './resources.controller';
import { IResourceService } from './resources.service';

describe('resources.router.ts', () => {
  let getResourcesFn: jest.Mock;
  let resourceServiceMock: IResourceService;
  let resourceController: ResourceController;

  beforeEach(() => {
    getResourcesFn = jest.fn();
    resourceServiceMock = {
      getResources: getResourcesFn,
    };
    resourceController = new ResourceController(resourceServiceMock);
  });

  it('when call resources endpoint with empty should return empty', async () => {
    const router = getRouter(resourceController);
    const app = buildApp([router]);
    const expected = [];
    getResourcesFn.mockResolvedValue(expected);

    await supertest(app)
      .get('/resources')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expected);
      });
  });

  it('when call resources get error then sould return 500', async () => {
    const router = getRouter(resourceController);
    const app = buildApp([router]);
    const rejection = new Error('test');
    getResourcesFn.mockRejectedValue(rejection);

    await supertest(app).get('/resources').expect(500);
  });
});

function buildApp(routes: express.Router[]): express.Express {
  const app = express();
  routes.forEach((r) => app.use(r));
  return app;
}
