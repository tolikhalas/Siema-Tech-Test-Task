import { UpdatePermissionDto } from "../update-permission.dto";

describe("UpdatePermissionDto", () => {
  it("should create an UpdatePermissionDto instance", () => {
    const dto = new UpdatePermissionDto();
    expect(dto).toBeDefined();
  });

  it("should allow partial updates", () => {
    const dto = new UpdatePermissionDto();
    expect(() => {
      const partialDto: Partial<UpdatePermissionDto> = {};
      Object.assign(dto, partialDto);
    }).not.toThrow();
  });
});
