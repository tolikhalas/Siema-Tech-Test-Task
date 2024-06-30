import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class Tenant {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  type: string;

  @Expose()
  @Column({ nullable: true })
  description: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.tenants, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;
}
