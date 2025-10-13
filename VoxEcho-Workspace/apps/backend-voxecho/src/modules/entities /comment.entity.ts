import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Post } from './incidentPost.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment {

//autogeenrated unique id for comments
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @ManyToOne(() => User, (user) => user.comments)
  user!: ()=> User;

  @Column()
  userId!: number;

  @ManyToOne(() => Post, (post) => post.comments)
  post!:()=> Post;

  @Column()
  postId!: number;

  // Self-referential for nested replies
  @ManyToOne(() => Comment, (parent) => parent.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent!: Comment;

  @Column({ nullable: true })
  parentId!: number;

  @OneToMany(() => Comment, (child) => child.parent)
  children!: ()=> Comment[];

  @CreateDateColumn()
  createdAt!: Date;
}


