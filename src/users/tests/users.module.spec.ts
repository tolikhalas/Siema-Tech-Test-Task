import { Test } from "@nestjs/testing";
import { UsersModule } from "../users.module";
import { UsersService } from "../users.service";
import { UsersController } from "../users.controller";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";

describe("UsersModule", () => {
  let usersModule: UsersModule;
  let usersController: UsersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [User],
          synchronize: true,
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      })
      .overrideProvider(UsersController)
      .useValue({
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    usersModule = module.get<UsersModule>(UsersModule);
    usersController = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(usersModule).toBeDefined();
  });

  it("should have UsersController as a controller", async () => {
    const controllers = Reflect.getMetadata("controllers", UsersModule);
    expect(controllers).toContain(UsersController);
  });

  it("should have UsersService as a provider", async () => {
    const providers = Reflect.getMetadata("providers", UsersModule);
    expect(providers).toContain(UsersService);
  });

  it("should provide UsersService", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    const usersService = moduleRef.get<UsersService>(UsersService);
    expect(usersService).toBeInstanceOf(UsersService);
  });

  it("should provide UsersController", async () => {
    expect(usersController).toBeInstanceOf(UsersController);
  });
});
