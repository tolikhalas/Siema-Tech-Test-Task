import { BadRequestException } from "@nestjs/common";
import { TenantsMiddleware } from "../tenants.middleware";
import { Request, Response } from "express";

describe("TenantsMiddleware", () => {
  let middleware: TenantsMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    middleware = new TenantsMiddleware();
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("should call next() when a valid x-tenant-id header is provided", () => {
    mockRequest.headers = { "x-tenant-id": "test-tenant" };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest["tenantId"]).toBe("test-tenant");
  });

  it("should throw BadRequestException when x-tenant-id header is missing", () => {
    mockRequest.headers = {};

    expect(() => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );
    }).toThrow(BadRequestException);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should throw BadRequestException when x-tenant-id header is empty", () => {
    mockRequest.headers = { "x-tenant-id": "" };

    expect(() => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );
    }).toThrow(BadRequestException);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should log the tenantId to console", () => {
    const consoleSpy = jest.spyOn(console, "log");
    mockRequest.headers = { "x-tenant-id": "test-tenant" };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(consoleSpy).toHaveBeenCalledWith("test-tenant");
    consoleSpy.mockRestore();
  });

  it("should handle non-string x-tenant-id header values", () => {
    mockRequest.headers = { "x-tenant-id": "123" };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest["tenantId"]).toBe("123");
  });
});
