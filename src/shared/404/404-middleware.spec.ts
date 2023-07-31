import { fourOFourMiddleware } from './404-middleware';
import { FakeReq, FakeRes } from '../test-utils';

describe('404 middleware', () => {
  it('should return a 404 status when the route does not exist', () => {
    const mocks = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const fakeReq = new FakeReq() as any;
    const fakeRes = new FakeRes(mocks) as any;
    const fakeNext = jest.fn();

    fourOFourMiddleware()(fakeReq, fakeRes, fakeNext);

    expect(mocks.status).toBeCalledWith(404);
    expect(mocks.json).toBeCalledWith({ message: 'Not Found' });
    expect(fakeNext).not.toBeCalled();
  });

  it('should not return a 404 status when the headers are sent', () => {
    const mocks = {
      status: jest.fn(),
      json: jest.fn(),
      headersSent: true,
    };
    const fakeReq = new FakeReq() as any;
    const fakeRes = new FakeRes(mocks) as any;
    const fakeNext = jest.fn();

    fourOFourMiddleware()(fakeReq, fakeRes, fakeNext);

    expect(mocks.status).not.toBeCalled();
    expect(mocks.json).not.toBeCalled();
    expect(fakeNext).toBeCalled();
  });
});
