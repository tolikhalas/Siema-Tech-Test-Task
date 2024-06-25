import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users.service";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { NotFoundException } from "@nestjs/common";
import { PaginateUsersDto } from "../dto/paginate-users.dto";
import { UserResponse } from "../dto/user-response.dto";

describe("UsersService", () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

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
    repository = module.get(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      };
      const user: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        hashPassword: jest.fn(),
      };
      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(result).toBeInstanceOf(UserResponse);
      expect(result).toEqual(new UserResponse(user));
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users: User[] = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "hash1",
          hashPassword: jest.fn(),
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "hash2",
          hashPassword: jest.fn(),
        },
      ];
      repository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ skip: 0, take: 10 });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(UserResponse);
      expect(result[1]).toBeInstanceOf(UserResponse);
    });

    it("should return users with pagination", async () => {
      const paginateUsersDto: PaginateUsersDto = { page: 2, limit: 5 };
      const users: User[] = [
        {
          id: 6,
          firstName: "User6",
          lastName: "Last6",
          email: "user6@example.com",
          password: "hash6",
          hashPassword: jest.fn(),
        },
        {
          id: 7,
          firstName: "User7",
          lastName: "Last7",
          email: "user7@example.com",
          password: "hash7",
          hashPassword: jest.fn(),
        },
      ];
      repository.find.mockResolvedValue(users);

      const result = await service.findAll(paginateUsersDto);

      expect(repository.find).toHaveBeenCalledWith({ skip: 5, take: 5 });
      expect(result).toHaveLength(2);
    });

    it("should throw NotFoundException when no users found", async () => {
      repository.find.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      const user: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hash1",
        hashPassword: jest.fn(),
      };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeInstanceOf(UserResponse);
      expect(result).toEqual(new UserResponse(user));
    });

    it("should throw NotFoundException when user not found", async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const updateUserDto: UpdateUserDto = { firstName: "Jane" };
      const existingUser: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hash1",
        hashPassword: jest.fn(),
      };
      const updatedUser: User = {
        ...existingUser,
        ...updateUserDto,
        hashPassword: jest.fn(),
      };
      repository.findOne.mockResolvedValue(existingUser);
      repository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toBeInstanceOf(UserResponse);
      expect(result).toEqual(new UserResponse(updatedUser));
    });

    it("should throw NotFoundException when user not found for update", async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const user: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hash1",
        hashPassword: jest.fn(),
      };
      repository.findOne.mockResolvedValue(user);
      repository.remove.mockResolvedValue(user);

      const result = await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(user);
      expect(result).toBeInstanceOf(UserResponse);
      expect(result).toEqual(new UserResponse(user));
    });

    it("should throw NotFoundException when user not found for removal", async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
