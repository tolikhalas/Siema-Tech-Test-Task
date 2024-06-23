import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "../auth.module";
import { AuthService } from "../auth.service";
import { AuthController } from "../auth.controller";
import { JwtStrategy } from "../jwt.strategy";
import { GoogleStrategy } from "../google.strategy";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

jest.mock("@nestjs/jwt", () => ({
  JwtModule: {
    register: jest.fn().mockReturnValue({}),
  },
}));

describe("AuthModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    process.env.JWT_SECRET = "test-secret";

    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should have AuthService defined", () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });

  it("should have AuthController defined", () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
  });

  it("should have JwtStrategy defined", () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
  });

  it("should have GoogleStrategy defined", () => {
    const googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
    expect(googleStrategy).toBeDefined();
  });

  it("should import UsersModule", () => {
    expect(AuthModule.imports).toContain(UsersModule);
  });

  it("should import PassportModule", () => {
    expect(AuthModule.imports).toContain(PassportModule);
  });

  it("should import JwtModule with correct options", () => {
    expect(JwtModule.register).toHaveBeenCalledWith({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    });
  });
});
