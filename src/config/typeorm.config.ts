import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const typeormConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) || true,
  logging: Boolean(process.env.DATABASE_LOGGING),
  autoLoadEntities: true,
};

export default typeormConfig;
