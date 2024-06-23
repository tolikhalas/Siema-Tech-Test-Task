import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";

jest.mock("@nestjs/jwt", () => ({
  JwtService: jest.fn(() => JwtServiceMock),
}));

const JwtServiceMock = {
  sign: jest.fn().mockReturnValue("mockedJwtToken"),
  verify: jest.fn().mockReturnValue({ userId: "mockedUserId" }),
};

const RepositoryMock = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: JwtServiceMock },
        { provide: getRepositoryToken(User), useValue: RepositoryMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  it("should validate user", async () => {
    const mockUser = { id: 1, email: "test", passport: "123" };
    RepositoryMock.findOne.mockResolvedValue(mockUser);

    const result = await authService.validateUser("test", "password");
    expect(result).toEqual(mockUser);
  });

  it("should login user", async () => {
    const mockUser: User = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "test",
      password: "123",
      hashPassword: jest.fn(),
    };
    const result = await authService.login(mockUser);
    expect(result).toEqual({ access_token: "mockedJwtToken" });
  });
});
