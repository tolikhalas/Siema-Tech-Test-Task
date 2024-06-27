import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsModule } from "../permissions.module";
import { PermissionsService } from "../permissions.service";
import { PermissionsController } from "../permissions.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Permission } from "../entities/permission.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";

describe("PermissionsModule", () => {
  let testingModule: TestingModule;

  beforeAll(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    };

    const mockUsersService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    testingModule = await Test.createTestingModule({
      imports: [PermissionsModule],
    })
      .overrideProvider(getRepositoryToken(Permission))
      .useValue(mockRepository)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockRepository)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(TypeOrmModule)
      .useValue({})
      .compile();
  });

  it("should be defined", () => {
    const module = testingModule.get<PermissionsModule>(PermissionsModule);
    expect(module).toBeDefined();
  });

  it("should export PermissionsService", async () => {
    const permissionsService =
      testingModule.get<PermissionsService>(PermissionsService);
    expect(permissionsService).toBeDefined();
  });

  it("should have PermissionsController", async () => {
    const permissionsController = testingModule.get<PermissionsController>(
      PermissionsController,
    );
    expect(permissionsController).toBeDefined();
  });

  it("should import TypeOrmModule for Permission entity", async () => {
    const typeOrmModule = testingModule.get(TypeOrmModule);
    expect(typeOrmModule).toBeDefined();
  });

  it("should import UsersModule", async () => {
    const usersService = testingModule.get<UsersService>(UsersService);
    expect(usersService).toBeDefined();
  });
});
