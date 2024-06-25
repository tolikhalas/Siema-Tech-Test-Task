import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsController } from "../permissions.controller";
import { PermissionsService } from "../permissions.service";
import { AssignPermissionsDto } from "../dto/assign-permissions.dto";

describe("PermissionsController", () => {
  let controller: PermissionsController;

  const mockPermissionsService = {
    assignUserPermissions: jest.fn(),
    getUserPermissions: jest.fn(),
    updateUserPermissions: jest.fn(),
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
      const permissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];

      mockPermissionsService.assignUserPermissions.mockResolvedValue(
        permissions,
      );

      const result = await controller.assignPermissions(
        userId,
        assignPermissionsDto,
      );

      expect(result).toEqual(permissions);
      expect(mockPermissionsService.assignUserPermissions).toHaveBeenCalledWith(
        +userId,
        assignPermissionsDto,
      );
    });
  });

  describe("getPermissions", () => {
    it("should return permissions for a user", async () => {
      const userId = "1";
      const permissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];

      mockPermissionsService.getUserPermissions.mockResolvedValue(permissions);

      const result = await controller.getPermissions(userId);

      expect(result).toEqual(permissions);
      expect(mockPermissionsService.getUserPermissions).toHaveBeenCalledWith(
        +userId,
      );
    });
  });

  describe("updatePermissions", () => {
    it("should update permissions for a user", async () => {
      const userId = "1";
      const assignPermissionsDto: AssignPermissionsDto = {
        permissionIds: [1, 2],
      };
      const updatedPermissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];

      mockPermissionsService.updateUserPermissions.mockResolvedValue(
        updatedPermissions,
      );

      const result = await controller.updatePermissions(
        userId,
        assignPermissionsDto,
      );

      expect(result).toEqual(updatedPermissions);
      expect(mockPermissionsService.updateUserPermissions).toHaveBeenCalledWith(
        +userId,
        assignPermissionsDto,
      );
    });
  });

  describe("removeUserPermissions", () => {
    it("should remove permissions from a user", async () => {
      const userId = "1";
      const assignPermissionsDto: AssignPermissionsDto = { permissionIds: [1] };
      const remainingPermissions = [{ id: 2, name: "PERMISSION_2" }];

      mockPermissionsService.removeUserPermissions.mockResolvedValue(
        remainingPermissions,
      );

      const result = await controller.findOne(userId, assignPermissionsDto);

      expect(result).toEqual(remainingPermissions);
      expect(mockPermissionsService.removeUserPermissions).toHaveBeenCalledWith(
        +userId,
        assignPermissionsDto,
      );
    });
  });
});
