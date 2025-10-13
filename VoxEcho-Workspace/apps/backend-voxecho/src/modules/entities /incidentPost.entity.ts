import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { LocationDto } from '../dto/incidentDto/location.dto';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Votes } from './incident-votes.entity';


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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: ()=> Comment[];

  @OneToMany(()=> Votes, (vote) => vote.posts)
  votes!: ()=> Votes[];
}
