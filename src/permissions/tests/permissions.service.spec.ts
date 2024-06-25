import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsService } from "../permissions.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Permission } from "../entities/permission.entity";
import { UsersService } from "src/users/users.service";
import { NotFoundException } from "@nestjs/common";
import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";
import { AssignPermissionsDto } from "../dto/assign-permissions.dto";

describe("PermissionsService", () => {
  let service: PermissionsService;

  const mockPermissionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new permission", async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: "TEST_PERMISSION",
      };
      const createdPermission = { id: 1, ...createPermissionDto };

      mockPermissionRepository.create.mockReturnValue(createdPermission);
      mockPermissionRepository.save.mockResolvedValue(createdPermission);

      const result = await service.create(createPermissionDto);

      expect(result).toEqual(createdPermission);
      expect(mockPermissionRepository.create).toHaveBeenCalledWith(
        createPermissionDto,
      );
      expect(mockPermissionRepository.save).toHaveBeenCalledWith(
        createdPermission,
      );
    });
  });

  describe("findAll", () => {
    it("should return an array of permissions", async () => {
      const permissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];
      mockPermissionRepository.find.mockResolvedValue(permissions);

      const result = await service.findAll();

      expect(result).toEqual(permissions);
      expect(mockPermissionRepository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a permission by id", async () => {
      const permission = { id: 1, name: "TEST_PERMISSION" };
      mockPermissionRepository.findOne.mockResolvedValue(permission);

      const result = await service.findOne(1);

      expect(result).toEqual(permission);
      expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundException if permission is not found", async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a permission", async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        name: "UPDATED_PERMISSION",
      };
      const existingPermission = { id: 1, name: "OLD_PERMISSION" };
      const updatedPermission = {
        ...existingPermission,
        ...updatePermissionDto,
      };

      mockPermissionRepository.findOne.mockResolvedValue(existingPermission);
      mockPermissionRepository.save.mockResolvedValue(updatedPermission);

      const result = await service.update(1, updatePermissionDto);

      expect(result).toEqual(updatedPermission);
      expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPermissionRepository.save).toHaveBeenCalledWith(
        updatedPermission,
      );
    });

    it("should throw NotFoundException if permission to update is not found", async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, { name: "UPDATED_PERMISSION" }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a permission", async () => {
      const permission = { id: 1, name: "TEST_PERMISSION" };
      mockPermissionRepository.findOne.mockResolvedValue(permission);

      await service.remove(1);

      expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPermissionRepository.remove).toHaveBeenCalledWith(permission);
    });

    it("should throw NotFoundException if permission to remove is not found", async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findPermissionByName", () => {
    it("should return a permission by name", async () => {
      const permission = { id: 1, name: "TEST_PERMISSION" };
      mockPermissionRepository.findOne.mockResolvedValue(permission);

      const result = await service.findPermissionByName("TEST_PERMISSION");

      expect(result).toEqual(permission);
      expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
        where: { name: "TEST_PERMISSION" },
      });
    });

    it("should throw NotFoundException if permission is not found by name", async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findPermissionByName("NON_EXISTENT"),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("assignPermissions", () => {
    it("should assign permissions to a user", async () => {
      const userId = 1;
      const assignPermissionsDto: AssignPermissionsDto = {
        permissionIds: [1, 2],
      };
      const user = { id: userId, permissions: [] };
      const permissions = [
        { id: 1, name: "PERMISSION_1" },
        { id: 2, name: "PERMISSION_2" },
      ];

      mockUsersService.findOne.mockResolvedValue(user);
      mockPermissionRepository.findOne
        .mockResolvedValueOnce(permissions[0])
        .mockResolvedValueOnce(permissions[1]);

      const result = await service.assignPermissions(
        userId,
        assignPermissionsDto,
      );

      expect(result).toEqual(permissions);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, {
        ...user,
        permissions,
      });
    });
  });

  describe("getUserPermissions", () => {
    it("should return user permissions", async () => {
      const userId = 1;
      const user = {
        id: userId,
        permissions: [
          { id: 1, name: "PERMISSION_1" },
          { id: 2, name: "PERMISSION_2" },
        ],
      };

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await service.getUserPermissions(userId);

      expect(result).toEqual(user.permissions);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe("removeUserPermissions", () => {
    it("should remove permissions from a user", async () => {
      const userId = 1;
      const assignPermissionsDto: AssignPermissionsDto = { permissionIds: [1] };
      const user = {
        id: userId,
        permissions: [
          { id: 1, name: "PERMISSION_1" },
          { id: 2, name: "PERMISSION_2" },
        ],
      };
      const permissionToRemove = { id: 1, name: "PERMISSION_1" };

      mockUsersService.findOne.mockResolvedValue(user);
      mockPermissionRepository.findOne.mockResolvedValue(permissionToRemove);

      const result = await service.removeUserPermissions(
        userId,
        assignPermissionsDto,
      );

      expect(result).toEqual([{ id: 2, name: "PERMISSION_2" }]);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, {
        ...user,
        permissions: [{ id: 2, name: "PERMISSION_2" }],
      });
    });
  });
});
