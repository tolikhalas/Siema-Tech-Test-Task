import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { Repository } from "typeorm";
import { Tenant } from "./entities/tenant.entity";
import { plainToClass } from "class-transformer";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class TenantsService {
  constructor(
    @Inject("TENANT_REPOSITORY")
    private readonly tenantsRepository: Repository<Tenant>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    const tenant = await this.tenantsRepository.save(createTenantDto);

    this.logger.info(`Tenant created with id[${tenant.id}]`, {
      ...tenant,
    });

    return plainToClass(Tenant, tenant, { excludeExtraneousValues: true });
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

    this.logger.log(`Updating tenant with id: ${tenant.id}`, tenant);

    return await this.tenantsRepository.save(tenant);
  }

  async remove(id: number) {
    const tenant = await this.findOne(id);

    this.logger.log(`Removing tenant with id: ${tenant.id}`, tenant);

    return await this.tenantsRepository.remove(tenant);
  }
}
