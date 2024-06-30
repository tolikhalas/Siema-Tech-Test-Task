import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude, Expose } from "class-transformer";
import { Permission } from "src/permissions/entities/permission.entity";
import { Tenant } from "src/tenants/entities/tenant.entity";

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column("text")
  firstName: string;

  @Expose()
  @Column("text", { nullable: true })
  lastName: string;

  @Expose()
  @Column("text", { unique: true })
  email: string;

  @Exclude()
  @Column("text")
  password: string;

  @Expose()
  @ManyToMany(() => Permission, (permission) => permission.user)
  @JoinTable()
  permissions: Permission[];

  @Exclude()
  @OneToMany(() => Tenant, (tenant) => tenant.user)
  tenants: Tenant[];

  @Exclude()
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
