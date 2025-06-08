import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'bigint', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number;

  @Column({ type: 'bigint', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: number;
}
