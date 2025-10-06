import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { LocationDto } from '../dto/incidentDto/location.dto';
import { User } from '../users/user.entity'; // 👈 type-only import

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  file!: string;

  @Column('jsonb', { nullable: true })
  location!: LocationDto[];

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => User, (user) => user.incidents)
  user!: ()=> User;
}
