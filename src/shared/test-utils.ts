export class FakeReq {
  constructor(public cookies: Record<string, string> = {}) {}
}

export interface ResponseMocks {
  status: jest.Mock;
  json: jest.Mock;
  headersSent?: boolean;
}

export class FakeRes {
  constructor(private mocks: ResponseMocks) {}

  get headersSent() {
    return this.mocks.headersSent;
  }

  status(value: number) {
    this.mocks.status(value);
    return this;
  }

  json(value: any) {
    this.mocks.json(value);
    return this;
  }
}
