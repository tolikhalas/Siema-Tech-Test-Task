import { TenantsMiddleware } from "./tenants.middleware";

describe("TenantsMiddleware", () => {
  it("should be defined", () => {
    expect(new TenantsMiddleware()).toBeDefined();
  });
});
