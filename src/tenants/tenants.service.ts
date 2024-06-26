import { Inject, Injectable } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { Repository } from "typeorm";
import { Tenant } from "./entities/tenant.entity";

@Injectable()
export class TenantsService {
  constructor(
    @Inject("TENANT_REPOSITORY")
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  create(createTenantDto: CreateTenantDto) {
    return "This action adds a new tenant";
  }

  async findAll() {
    return await this.tenantRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
