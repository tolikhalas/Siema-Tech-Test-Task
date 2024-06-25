import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsController } from "../permissions.controller";
import { PermissionsService } from "../permissions.service";
import { AssignPermissionsDto } from "../dto/assign-permissions.dto";

describe("PermissionsController", () => {
  let controller: PermissionsController;

  const mockPermissionsService = {
    assignPermissions: jest.fn(),
    getUserPermissions: jest.fn(),
    removeUserPermissions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("assignPermissions", () => {
    it("should assign permissions to a user", async () => {
      const userId = "1";
      const assignPermissionsDto: AssignPermissionsDto = {
        permissionIds: [1, 2],
      };
      const expectedPermissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];

      mockPermissionsService.assignPermissions.mockResolvedValue(
        expectedPermissions,
      );

      const result = await controller.assignPermissions(
        userId,
        assignPermissionsDto,
      );

      expect(result).toEqual(expectedPermissions);
      expect(mockPermissionsService.assignPermissions).toHaveBeenCalledWith(
        +userId,
        assignPermissionsDto,
      );
    });
  });

  describe("getPermissions", () => {
    it("should get permissions for a user", async () => {
      const userId = "1";
      const expectedPermissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];

      mockPermissionsService.getUserPermissions.mockResolvedValue(
        expectedPermissions,
      );

      const result = await controller.getPermissions(userId);

      expect(result).toEqual(expectedPermissions);
      expect(mockPermissionsService.getUserPermissions).toHaveBeenCalledWith(
        +userId,
      );
    });
  });

  describe("removePermissions", () => {
    it("should remove permissions from a user", async () => {
      const userId = "1";
      const assignPermissionsDto: AssignPermissionsDto = { permissionIds: [1] };
      const expectedPermissions = [{ id: 2, name: "PERMISSION_2" }];

      mockPermissionsService.removeUserPermissions.mockResolvedValue(
        expectedPermissions,
      );

      const result = await controller.findOne(userId, assignPermissionsDto);

      expect(result).toEqual(expectedPermissions);
      expect(mockPermissionsService.removeUserPermissions).toHaveBeenCalledWith(
        +userId,
        assignPermissionsDto,
      );
    });
  });
});
