import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { Repository } from "typeorm";
import { Tenant } from "./entities/tenant.entity";

@Injectable()
export class TenantsService {
  constructor(
    @Inject("TENANT_REPOSITORY")
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    return await this.tenantsRepository.save(createTenantDto);
  }

  async findAll() {
    return await this.tenantsRepository.find();
  }

  async findOne(id: number) {
    const tenant = await this.tenantsRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with id[${id}] not found`);
    }
    return tenant;
  }

  async update(id: number, updateTenantDto: UpdateTenantDto) {
    const tenant = await this.findOne(id);
    Object.assign(tenant, updateTenantDto);
    return await this.tenantsRepository.save(tenant);
  }

  async remove(id: number) {
    const tenant = await this.findOne(id);
    return await this.tenantsRepository.remove(tenant);
  }
}
