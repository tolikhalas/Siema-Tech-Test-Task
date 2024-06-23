import { Test, TestingModule } from "@nestjs/testing";
import { JwtStrategy } from "../jwt.strategy";

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    process.env.JWT_SECRET = "test-secret";

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe("validate", () => {
    it("should return a user object when jwt payload is valid", async () => {
      const payload = { sub: 1, email: "test@example.com" };
      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({ userId: payload.sub, email: payload.email });
    });
  });
});
