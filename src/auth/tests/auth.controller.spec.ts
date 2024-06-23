import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserResponse } from "src/users/dto/user-response.dto";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("login", () => {
    it("should return a JWT token for valid credentials", async () => {
      const loginDto = { email: "test@example.com", password: "password123" };
      const user = new UserResponse();
      user.email = loginDto.email;
      const jwtToken = { access_token: "mockJwtToken" };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(jwtToken);

      const result = await authController.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(jwtToken);
    });

    it("should throw UnauthorizedException for invalid credentials", async () => {
      const loginDto = { email: "test@example.com", password: "wrongpassword" };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
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

      mockAuthService.register.mockResolvedValue(userResponse);

      const result = await authController.create(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(userResponse);
    });
  });

  describe("googleLogin", () => {
    it("should initiate Google OAuth login", async () => {
      const result = await authController.googleLogin();
      expect(result).toBeUndefined();
    });
  });

  describe("googleCallback", () => {
    it("should handle Google OAuth callback", async () => {
      const req = { user: { email: "test@example.com" } };
      const res = {
        set: jest.fn(),
        json: jest.fn(),
      };
      const jwtToken = { access_token: "mockJwtToken" };

      mockAuthService.login.mockResolvedValue(jwtToken);

      await authController.googleCallback(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(res.set).toHaveBeenCalledWith(
        "authorization",
        jwtToken.access_token,
      );
      expect(res.json).toHaveBeenCalledWith(req.user);
    });
  });
});
