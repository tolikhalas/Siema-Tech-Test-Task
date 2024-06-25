import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "../users.module";
import { UsersService } from "../users.service";
import { UsersController } from "../users.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";

describe("UsersModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockRepository = {
      // Add any repository methods you use in your service
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockRepository)
      .compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should provide UsersService", () => {
    const usersService = module.get<UsersService>(UsersService);
    expect(usersService).toBeDefined();
    expect(usersService).toBeInstanceOf(UsersService);
  });

  it("should provide UsersController", () => {
    const usersController = module.get<UsersController>(UsersController);
    expect(usersController).toBeDefined();
    expect(usersController).toBeInstanceOf(UsersController);
  });
});
