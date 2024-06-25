import { DataSource, DataSourceOptions } from "typeorm";
import typeormConfig from "./typeorm.config";

export const dataSourceOptions: DataSourceOptions = {
  ...(typeormConfig as DataSourceOptions),
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/database/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
