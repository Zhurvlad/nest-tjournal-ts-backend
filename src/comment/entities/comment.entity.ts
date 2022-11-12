import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { PostEntity } from '../../post/entities/post.entity';

//Создаёт в БД колонки с параметрами

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;



  //Говорим что одному юзеру может принадлежать много комментариев
  // и добавляем колонку для того чтобы в ней сохранить
  // Айди юзера который написал коммент
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'UserId' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
