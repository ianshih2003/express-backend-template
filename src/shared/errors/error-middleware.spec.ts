import { errorHandlerMiddleware } from './error-middleware';
import { AppError } from './app-error';
import { FakeReq, FakeRes } from '../test-utils';

class CustomError extends AppError {
  constructor(msg: string) {
    super(msg, 451, true);
  }
}

describe('error handler middleware', () => {
  it('should handle an AppError and respond with its information', () => {
    const mocks = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const error = new AppError('Custom message', 503, true);
    const fakeHandler = jest.fn();
    const fakeReq = new FakeReq() as any;
    const fakeRes = new FakeRes(mocks) as any;
    const fakeNext = jest.fn();

    errorHandlerMiddleware({ handleError: fakeHandler })(error, fakeReq, fakeRes, fakeNext);

    expect(fakeHandler).toBeCalledWith(error);
    expect(mocks.status).toBeCalledWith(503);
    expect(mocks.json).toBeCalledWith({
      httpStatus: 503,
      isOperational: true,
      message: 'Custom message',
      name: 'AppError',
    });
    expect(fakeNext).not.toBeCalled();
  });

  it('should handle a custom error and respond with its information', () => {
    const mocks = {
      status: jest.fn(),
      json: jest.fn(),
    };

    const error = new CustomError('Test Error');
    const fakeHandler = jest.fn();
    const fakeReq = new FakeReq() as any;
    const fakeRes = new FakeRes(mocks) as any;
    const fakeNext = jest.fn();

    errorHandlerMiddleware({ handleError: fakeHandler })(error, fakeReq, fakeRes, fakeNext);

    expect(fakeHandler).toBeCalledWith(error);
    expect(mocks.json).toBeCalledWith({
      httpStatus: 451,
      isOperational: true,
      message: 'Test Error',
      name: 'CustomError',
    });
    expect(fakeNext).not.toBeCalled();
  });

  it('should handle a normal error and respond with its information', () => {
    const mocks = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const error = new Error('My message');
    const fakeHandler = jest.fn();
    const fakeReq = new FakeReq() as any;
    const fakeRes = new FakeRes(mocks) as any;
    const fakeNext = jest.fn();

    errorHandlerMiddleware({ handleError: fakeHandler })(error, fakeReq, fakeRes, fakeNext);

    expect(fakeHandler).toBeCalledWith(error);
    expect(mocks.status).toBeCalledWith(500);
    expect(mocks.json).toBeCalledWith({ message: 'My message' });
    expect(fakeNext).not.toBeCalled();
  });
});
