import { ResourcesService } from './resources.service';
import { ResourcesClient } from './client';
import { HttpResponse } from '../../shared/http';

describe('resources.service.ts', () => {
  let clientMock: ResourcesClient;
  let service: ResourcesService;
  let getExternalResourcesFn: jest.Mock;

  beforeEach(() => {
    getExternalResourcesFn = jest.fn();
    clientMock = {
      getExternalResources: getExternalResourcesFn,
    };
    service = new ResourcesService(clientMock);
  });

  it('when call client and return empty result then should return empty response', async () => {
    const response: HttpResponse = {
      data: [],
      status: 200,
      headers: {},
    };
    getExternalResourcesFn.mockResolvedValueOnce(response);
    const res = await service.getResources();
    expect(res).toStrictEqual([]);
  });

  it('when call client and return not empty result then should map result', async () => {
    const id = 'id';
    const description = 'description';

    const externalResponseBody = {
      description: description,
      id: id,
    };
    const externalResponse: HttpResponse = {
      data: [externalResponseBody],
      status: 200,
      headers: {},
    };
    const expected = {
      description: description,
      id: id,
      foo: id.concat(description),
    };
    getExternalResourcesFn.mockResolvedValueOnce(externalResponse);
    // When
    const result = await service.getResources();

    // Then
    let firstResult = result[0];
    expect(firstResult.foo).toBe(expected.foo);
    expect(firstResult.id).toBe(expected.id);
    expect(firstResult.description).toBe(expected.description);
  });

  it('when call client and throw then should throw error', async () => {
    const rejection = 'error';
    getExternalResourcesFn.mockRejectedValue(new Error(rejection));
    await expect(service.getResources()).rejects.toThrow(rejection);
  });
});
