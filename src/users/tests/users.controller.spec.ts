import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };
      const expectedResult: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      jest.spyOn(service, "create").mockResolvedValue(expectedResult);

      expect(await controller.create(createUserDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const expectedResult: User[] = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "XXXXXXXXXXX",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "XXXXXXXXXXX",
        },
      ];

      jest.spyOn(service, "findAll").mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single user", async () => {
      const userId = "1";
      const expectedResult: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      jest.spyOn(service, "findOne").mockResolvedValue(expectedResult);

      expect(await controller.findOne(userId)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+userId);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId = "1";
      const updateUserDto: UpdateUserDto = {
        firstName: "Jane",
        lastName: "Smith",
      };
      const expectedResult: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      jest.spyOn(service, "update").mockResolvedValue(expectedResult);

      expect(await controller.update(userId, updateUserDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const userId = "1";
      const expectedResult: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      jest.spyOn(service, "remove").mockResolvedValue(expectedResult);

      expect(await controller.remove(userId)).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(+userId);
    });
  });
});
