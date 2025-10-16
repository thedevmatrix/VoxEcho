import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Post } from './incidentPost.entity';

export enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN',
}

@Entity('votes')
@Index(['userId', 'votableId', 'votableType'], { unique: true }) // Prevent duplicate votes per user per item
export class Votes {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: VoteType })
  type!: VoteType;

  @Column('text') // 'post' or 'comment'
  votableType!: string;

  @Column()
  votableId!: string;

  @ManyToOne(() => User, (user) => user.votes)
  user!: ()=> User;

  @ManyToOne(() => Post, (post)=> post.votes)
  posts!: ()=> Post[]

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  // Optional: Add updatedAt if allowing vote toggles
  // @UpdateDateColumn()
  // updatedAt: Date;
}