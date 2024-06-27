import { Test, TestingModule } from "@nestjs/testing";
import { TenantsController } from "../tenants.controller";
import { TenantsService } from "../tenants.service";
import { CreateTenantDto } from "../dto/create-tenant.dto";
import { UpdateTenantDto } from "../dto/update-tenant.dto";
import { Tenant } from "../entities/tenant.entity";

describe("TenantsController", () => {
  let controller: TenantsController;
  let service: TenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get<TenantsService>(TenantsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new tenant", async () => {
      const createTenantDto: CreateTenantDto = {
        name: "Test Tenant",
        type: "Test Type",
        description: "Test Description",
      };
      const expectedResult = {
        id: 1,
        ...createTenantDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Tenant;

      jest.spyOn(service, "create").mockResolvedValue(expectedResult);

      expect(await controller.create(createTenantDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTenantDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of tenants", async () => {
      const expectedResult: Tenant[] = [
        {
          id: 1,
          name: "Tenant 1",
          type: "Type 1",
          description: "Desc 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Tenant 2",
          type: "Type 2",
          description: "Desc 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, "findAll").mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single tenant", async () => {
      const expectedResult: Tenant = {
        id: 1,
        name: "Test Tenant",
        type: "Test Type",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, "findOne").mockResolvedValue(expectedResult);

      expect(await controller.findOne("1")).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe("update", () => {
    it("should update a tenant", async () => {
      const updateTenantDto: UpdateTenantDto = {
        name: "Updated Tenant",
      };
      const expectedResult: Tenant = {
        id: 1,
        name: "Updated Tenant",
        type: "Test Type",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, "update").mockResolvedValue(expectedResult);

      expect(await controller.update("1", updateTenantDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(1, updateTenantDto);
    });
  });

  describe("remove", () => {
    it("should remove a tenant", async () => {
      const expectedResult: Tenant = {
        id: 1,
        name: "Test Tenant",
        type: "Test Type",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, "remove").mockResolvedValue(expectedResult);

      expect(await controller.remove("1")).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
