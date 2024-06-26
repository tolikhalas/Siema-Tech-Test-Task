import { Test, TestingModule } from "@nestjs/testing";
import { DataSource, Repository } from "typeorm";
import { TenantRepositoryProvider } from "../tenant-repository.provider";
import { Tenant } from "src/tenants/entities/tenant.entity";

describe("TenantRepositoryProvider", () => {
  let provider: any;
  let mockDataSource: Partial<DataSource>;

  const mockProvider = {
    useFactory: () => jest.fn(),
  };

  beforeEach(async () => {
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue({} as Repository<Tenant>),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: "TENANT_CONNECTION",
          useValue: mockDataSource,
        },
        TenantRepositoryProvider,
      ],
    }).compile();

    provider = module.get<any>("TENANT_REPOSITORY");
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });

  it("should return a repository for the Tenant entity", () => {
    const result = mockProvider.useFactory();

    expect(result).toBeDefined();
    expect(mockDataSource.getRepository).toHaveBeenCalledWith(Tenant);
  });
});
