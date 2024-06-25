import { CreatePermissionDto } from "../create-permission.dto";

describe("CreatePermissionDto", () => {
  it("should create a CreatePermissionDto instance", () => {
    const dto = new CreatePermissionDto();
    expect(dto).toBeDefined();
  });
});
