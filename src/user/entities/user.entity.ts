import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { CommentEntity } from '../../comment/entities/comment.entity';

//Создаёт в БД колонки с параметрами

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    eager: false,
    nullable: true
  })
  comment: CommentEntity[]

  @Column({ nullable: false })
  password?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
