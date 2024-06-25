import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { PaginateUsersDto } from "../dto/paginate-users.dto";
import { UserResponse } from "../dto/user-response.dto";

describe("UsersController", () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      };
      const expectedResult = new UserResponse({ id: 1, ...createUserDto });
      service.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const paginateUsersDto: PaginateUsersDto = { page: 1, limit: 10 };
      const expectedResult = [
        new UserResponse({
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        }),
        new UserResponse({
          id: 2,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
        }),
      ];
      service.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginateUsersDto);

      expect(service.findAll).toHaveBeenCalledWith(paginateUsersDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findOne", () => {
    it("should return a user", async () => {
      const userId = "1";
      const expectedResult = new UserResponse({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
      service.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId = "1";
      const updateUserDto: UpdateUserDto = { firstName: "Jane" };
      const expectedResult = new UserResponse({
        id: 1,
        firstName: "Jane",
        lastName: "Doe",
        email: "john@example.com",
      });
      service.update.mockResolvedValue(expectedResult);

      const result = await controller.update(userId, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const userId = "1";
      const expectedResult = new UserResponse({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
      service.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
