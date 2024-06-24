import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude, Expose } from "class-transformer";
import { Permission } from "src/permissions/entities/permission.entity";

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
