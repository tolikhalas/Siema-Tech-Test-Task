import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserResponse } from "src/users/dto/user-response.dto";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  let authService: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe("validateUser", () => {
    it("should return a user if email and password are valid", async () => {
      const user = new User();
      user.email = "test@example.com";
      user.password = await bcrypt.hash("password123", 10);

      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await authService.validateUser(
        "test@example.com",
        "password123",
      );

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(result).toBeInstanceOf(UserResponse);
    });

    it("should return null if user is not found", async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(
        "nonexistent@example.com",
        "password123",
      );

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com",
      );
      expect(result).toBeNull();
    });

    it("should return null if password is invalid", async () => {
      const user = new User();
      user.email = "test@example.com";
      user.password = await bcrypt.hash("password123", 10);

      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await authService.validateUser(
        "test@example.com",
        "wrongpassword",
      );

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(result).toBeNull();
    });
  });

  describe("register", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      };

      const userResponse = new UserResponse();
      Object.assign(userResponse, createUserDto);

      mockUsersService.create.mockResolvedValue(userResponse);

      const result = await authService.register(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(userResponse);
    });
  });

  describe("login", () => {
    it("should return a JWT token for a valid user", async () => {
      const user = new User();
      user.id = 1;
      user.email = "test@example.com";

      const token = "mockJwtToken";
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
