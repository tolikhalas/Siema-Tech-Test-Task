import { PermissionsService } from "src/permissions/permissions.service";
import { Permission } from "../permission.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { CreatePermissionDto } from "src/permissions/dto/create-permission.dto";
import { User } from "src/users/entities/user.entity";

describe("Permission Entity", () => {
  let service: PermissionsService;

  const mockPermissionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it("should create a Permission instance", () => {
    const permission = new Permission();
    permission.id = 1;
    permission.name = "TEST_PERMISSION";

    expect(permission).toBeDefined();
    expect(permission.id).toBe(1);
    expect(permission.name).toBe("TEST_PERMISSION");
  });

  it("should have correct properties", async () => {
    const createPermissionDto: CreatePermissionDto = {
      name: "PERMISSION_1",
    };

    const createdPermission: Permission = {
      id: 1,
      ...createPermissionDto,
      user: new User(),
    };

    mockPermissionRepository.create.mockReturnValue(createdPermission);
    mockPermissionRepository.save.mockResolvedValue(createdPermission);

    const permission = await service.create(createPermissionDto);
    expect(permission).toHaveProperty("id");
    expect(permission).toHaveProperty("name");
    expect(permission).toHaveProperty("user");
  });
});
