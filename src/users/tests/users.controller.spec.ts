import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { PaginateUsersDto } from "../dto/paginate-users.dto";
import { NotFoundException } from "@nestjs/common";

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
    it("should return an array of users with default pagination", async () => {
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

      expect(await controller.findAll({ page: 1, limit: 10 })).toBe(
        expectedResult,
      );
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it("should return an array of users with custom pagination", async () => {
      const paginateUsersDto: PaginateUsersDto = { page: 2, limit: 5 };
      const expectedResult: User[] = [
        {
          id: 6,
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          password: "XXXXXXXXXXX",
        },
        {
          id: 7,
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@example.com",
          password: "XXXXXXXXXXX",
        },
      ];

      jest.spyOn(service, "findAll").mockResolvedValue(expectedResult);

      expect(await controller.findAll(paginateUsersDto)).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(paginateUsersDto);
    });

    it("should handle NotFoundException", async () => {
      jest
        .spyOn(service, "findAll")
        .mockRejectedValue(new NotFoundException("No users found"));

      await expect(controller.findAll(new PaginateUsersDto())).rejects.toThrow(
        NotFoundException,
      );
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

    it("should handle NotFoundException", async () => {
      const userId = "999";
      jest
        .spyOn(service, "findOne")
        .mockRejectedValue(
          new NotFoundException(`User with id[${userId}] not found`),
        );

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
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
        firstName: "Jane",
        lastName: "Smith",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      jest.spyOn(service, "update").mockResolvedValue(expectedResult);

      expect(await controller.update(userId, updateUserDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });

    it("should handle NotFoundException", async () => {
      const userId = "999";
      const updateUserDto: UpdateUserDto = {
        firstName: "Jane",
        lastName: "Smith",
      };
      jest
        .spyOn(service, "update")
        .mockRejectedValue(
          new NotFoundException(`User with id[${userId}] not found`),
        );

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
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

    it("should handle NotFoundException", async () => {
      const userId = "999";
      jest
        .spyOn(service, "remove")
        .mockRejectedValue(
          new NotFoundException(`User with id[${userId}] not found`),
        );

      await expect(controller.remove(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
