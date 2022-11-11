import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { OutputBlockData } from '../dto/create-post.dto';
import { UserEntity } from '../../user/entities/user.entity';

//Создаёт в БД колонки с параметрами

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({type: 'jsonb', nullable: true}, )
  body: OutputBlockData[];

  @Column()
  description: string

    //Связываем посты с юзером. Eager делает эту связь
  @ManyToOne(() => UserEntity, {eager: true})
  user: UserEntity

  @Column({
    default: 0,
  })
  views: number;

  @Column({ nullable: true })
  tags?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
