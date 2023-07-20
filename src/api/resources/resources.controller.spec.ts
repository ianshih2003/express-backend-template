import { ResourceController } from './resources.controller';
import { FakeReq, FakeRes } from '../../shared/test-utils';

describe("resources.controller.ts", () => {
    let getResourcesFn;
    let resourceServiceMock;
    let resourceController: ResourceController;

    beforeEach(() => {
        getResourcesFn = jest.fn()
        resourceServiceMock = {
            getResources: getResourcesFn,
        };
        resourceController = new ResourceController(resourceServiceMock);

    });

    it("getResources when not fail then should response ok", async () => {
        const mocks = {
            status: jest.fn(),
            json: jest.fn(),
        };
        const req = new FakeReq() as any;
        const res = new FakeRes(mocks) as any;
        const next = jest.fn();

        getResourcesFn.mockResolvedValue([]);

        await resourceController.getResources(req, res, next);

        expect(next).toBeCalledTimes(0);
        expect(mocks.json).toBeCalledWith([]);
    });

    it("getResources when fail then should call next", async () => {
        const mocks = {
            status: jest.fn(),
            json: jest.fn(),
        };
        const req = new FakeReq() as any;
        const res = new FakeRes(mocks) as any;
        const next = jest.fn();

        getResourcesFn.mockRejectedValue("error");

        await resourceController.getResources(req, res, next);

        expect(next).toBeCalledTimes(1);
        expect(mocks.json).toBeCalledTimes(0);
    });
});