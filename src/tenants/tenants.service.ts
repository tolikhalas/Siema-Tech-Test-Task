import { Inject, Injectable } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { DataSource } from "typeorm";
import { TenantConnectionProvider } from "src/providers/tenant-connection.provider";

@Injectable()
export class TenantsService {
  constructor(
    @Inject(TenantConnectionProvider.provide)
    private readonly dataSource: DataSource,
  ) {}

  create(createTenantDto: CreateTenantDto) {
    return "This action adds a new tenant";
  }

  findAll() {
    return this.dataSource.options.database as string;
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
