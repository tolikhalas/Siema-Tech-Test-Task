import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users.service";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

describe("UsersService", () => {
  let service: UsersService;
  let mockUserRepository: Repository<User>;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserRepository = module.get(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(mockUserRepository).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };
      const expectedUser: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(mockRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const expectedUsers: User[] = [
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

      mockRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      const userId = 1;
      const expectedUser: User = {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOne(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedUser);
    });

    it("should return undefined if user is not found", async () => {
      const userId = 999;

      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOne(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        id: userId,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "XXXXXXXXXXX",
      };
      const existingUser: User = {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };
      const updatedUser: User = { ...existingUser, ...updateUserDto };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it("should throw an error if user is not found", async () => {
      const userId = 999;
      const updateUserDto: UpdateUserDto = {
        id: userId,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "XXXXXXXXXXX",
      };

      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const userId = 1;
      const userToRemove: User = {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      mockRepository.findOne.mockResolvedValue(userToRemove);
      mockRepository.remove.mockResolvedValue(userToRemove);

      const result = await service.remove(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(userToRemove);
      expect(result).toEqual(userToRemove);
    });

    it("should throw an error if user is not found", async () => {
      const userId = 999;

      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove(userId)).rejects.toThrow("User not found");
    });
  });
});