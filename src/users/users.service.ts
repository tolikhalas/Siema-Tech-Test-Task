import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { PaginateUsersDto } from "./dto/paginate-users.dto";
import { UserResponse } from "./dto/user-response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    return new UserResponse(user);
  }

  async findAll(paginateUsersDto?: PaginateUsersDto): Promise<UserResponse[]> {
    const { page = 1, limit = 10 } = paginateUsersDto ?? {};
    const skip = (page - 1) * limit;

    const users = await this.usersRepository.find({
      skip,
      take: limit,
    });
    if (users.length === 0) {
      throw new NotFoundException("No users found");
    }
    return users.map((user) => new UserResponse(user));
  }

  async findOne(id: number): Promise<UserResponse | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id[${id}] not found`);
    }
    return new UserResponse(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id[${id}] not found`);
    }
    const updatedUser = { ...user, ...updateUserDto };
    await this.usersRepository.save(updatedUser);
    return new UserResponse(user);
  }

  async remove(id: number): Promise<UserResponse | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id[${id}] not found`);
    }
    await this.usersRepository.remove(user);
    return new UserResponse(user);
  }
}
