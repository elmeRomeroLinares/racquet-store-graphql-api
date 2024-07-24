import { randomUUID } from "crypto";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
