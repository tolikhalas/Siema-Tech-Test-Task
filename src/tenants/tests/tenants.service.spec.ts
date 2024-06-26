import { Test, TestingModule } from "@nestjs/testing";
import { TenantsService } from "../tenants.service";
import { Repository } from "typeorm";
import { Tenant } from "../entities/tenant.entity";
import { CreateTenantDto } from "../dto/create-tenant.dto";
import { UpdateTenantDto } from "../dto/update-tenant.dto";
import { NotFoundException } from "@nestjs/common";

describe("TenantsService", () => {
  let service: TenantsService;
  let repository: Repository<Tenant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: "TENANT_REPOSITORY",
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    repository = module.get<Repository<Tenant>>("TENANT_REPOSITORY");
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new tenant", async () => {
      const createTenantDto: CreateTenantDto = {
        name: "Test Tenant",
        type: "Test Type",
        description: "Test Description",
      };
      const expectedTenant = { id: 1, ...createTenantDto };

      jest
        .spyOn(repository, "save")
        .mockResolvedValue(expectedTenant as Tenant);

      const result = await service.create(createTenantDto);
      expect(result).toEqual(expectedTenant);
      expect(repository.save).toHaveBeenCalledWith(createTenantDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of tenants", async () => {
      const expectedTenants = [
        { id: 1, name: "Tenant 1" },
        { id: 2, name: "Tenant 2" },
      ];
      jest
        .spyOn(repository, "find")
        .mockResolvedValue(expectedTenants as Tenant[]);

      const result = await service.findAll();
      expect(result).toEqual(expectedTenants);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a tenant by id", async () => {
      const expectedTenant = { id: 1, name: "Test Tenant" };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(expectedTenant as Tenant);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedTenant);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should throw NotFoundException if tenant is not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("update", () => {
    it("should update a tenant", async () => {
      const updateTenantDto: UpdateTenantDto = { name: "Updated Tenant" };
      const existingTenant = { id: 1, name: "Old Name", type: "Test Type" };
      const updatedTenant = { ...existingTenant, ...updateTenantDto };

      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(existingTenant as Tenant);
      jest.spyOn(repository, "save").mockResolvedValue(updatedTenant as Tenant);

      const result = await service.update(1, updateTenantDto);
      expect(result).toEqual(updatedTenant);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedTenant);
    });

    it("should throw NotFoundException if tenant to update is not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("remove", () => {
    it("should remove a tenant", async () => {
      const tenant = { id: 1, name: "Test Tenant" };
      jest.spyOn(repository, "findOne").mockResolvedValue(tenant as Tenant);
      jest.spyOn(repository, "remove").mockResolvedValue(tenant as Tenant);

      const result = await service.remove(1);
      expect(result).toEqual(tenant);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(tenant);
    });

    it("should throw NotFoundException if tenant to remove is not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
