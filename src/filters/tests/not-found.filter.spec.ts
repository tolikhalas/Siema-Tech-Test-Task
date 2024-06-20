import { NotFoundException, HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundFilter } from "../not-found.filter";

describe("NotFoundFilter", () => {
  let filter: NotFoundFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotFoundFilter],
    }).compile();

    filter = module.get<NotFoundFilter>(NotFoundFilter);
  });

  it("should handle NotFoundException and return a 404 response", () => {
    const exception = new NotFoundException("Resource not found");
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockResponse = {
      status: mockStatus,
    };
    const mockGetResponse = jest.fn().mockReturnValue(mockResponse);
    const mockGetRequest = jest.fn();
    const mockGetNext = jest.fn();
    const mockHttpArgumentsHost = {
      getResponse: mockGetResponse,
      getRequest: mockGetRequest,
      getNext: mockGetNext,
    };

    const mockArgumentsHost = {
      switchToHttp: () => mockHttpArgumentsHost,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 404,
      message: exception.message,
    });
  });

  it("should only handle NotFoundException", () => {
    const exception = new HttpException("Internal Server Error", 500);
    const mockGetResponse = jest.fn();
    const mockHttpArgumentsHost = {
      getResponse: mockGetResponse,
      getRequest: jest.fn(),
      getNext: jest.fn(),
    };
    const mockArgumentsHost = {
      switchToHttp: () => mockHttpArgumentsHost,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    expect(() => filter.catch(exception, mockArgumentsHost)).toThrow(TypeError);
  });
});
