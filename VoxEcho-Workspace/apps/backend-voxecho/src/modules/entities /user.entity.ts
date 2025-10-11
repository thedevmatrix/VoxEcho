import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import  { Post } from '../entities /incidentPost.entity'; 
import { Comment} from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstname!: string;

  @Column()
  lastName!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column()
  email!: string;

  @Column()
  dob!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Post, (post) => post.user)
  incidents!: ()=> Post[];

  @OneToMany(()=> Comment, (comment) => comment.user)
  comments!: ()=>  Comment[];
}
