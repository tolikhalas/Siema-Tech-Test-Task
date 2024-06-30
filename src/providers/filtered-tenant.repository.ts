import {
  Repository,
  DataSource,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  SaveOptions,
} from "typeorm";
import { Tenant } from "src/tenants/entities/tenant.entity";
import { User } from "src/users/entities/user.entity";
import { CreateTenantDto } from "src/tenants/dto/create-tenant.dto";

export class UserFilteredTenantRepository extends Repository<Tenant> {
  private user: User;

  constructor(dataSource: DataSource, user: User) {
    super(Tenant, dataSource.createEntityManager());
    this.user = user;
  }

  override find(options?: FindManyOptions<Tenant>): Promise<Tenant[]> {
    const userFilteredOptions: FindManyOptions<Tenant> = {
      ...options,
      where: {
        ...(options?.where as object),
        user: { id: this.user.id },
      },
    };
    return super.find(userFilteredOptions);
  }

  override findOne(options: FindOneOptions<Tenant>): Promise<Tenant | null> {
    const userFilteredOptions: FindOneOptions<Tenant> = {
      ...options,
      where: {
        ...(options.where as object),
        user: { id: this.user.id },
      },
    };
    return super.findOne(userFilteredOptions);
  }

  override save<CreateTenantDto>(
    deepPartialTenant: CreateTenantDto,
    options?: SaveOptions & { reload: false },
  ) {
    return super.save({ user: this.user, ...deepPartialTenant }, options);
  }
}
