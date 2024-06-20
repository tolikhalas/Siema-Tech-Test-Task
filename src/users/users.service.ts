import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { PaginateUsersDto } from "./dto/paginate-users.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }

  async findAll(paginateUsersDto?: PaginateUsersDto): Promise<User[]> {
    const { page = 1, limit = 10 } = paginateUsersDto ?? {};
    const skip = (page - 1) * limit;

    const users = await this.usersRepository.find({
      skip,
      take: limit,
    });
    if (users.length === 0) {
      throw new NotFoundException("No users found");
    }
    return users;
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id[${id}] not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id[${id}] not found`);
    }
    const updatedUser = { ...user, ...updateUserDto };
    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id[${id}] not found`);
    }
    return await this.usersRepository.remove(user);
  }
}
