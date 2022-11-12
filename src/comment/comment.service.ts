import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}

  async create(dto: CreateCommentDto, userId: number) {
    const comment = await this.repository.save({
      text: dto.text,
      post: { id: dto.postId },
      user: { id: userId },
    });

    return this.repository.findOne({id: comment.id}, {relations: ['user']})
  }

  async findAll(postId: number) {
    //Достаем из определённой записи коментарии которые были написаны к ней
    const qb = this.repository
      .createQueryBuilder('comments')

    if(postId){
      qb.where('comments.postId = :postId', {postId})
    }

    //Достаем посты и делаем релейшен с ID в котором оставили коммент так же подключаем сюда Юзера
    const result = await qb
      .leftJoinAndSelect('comments.post', 'post')
      .leftJoinAndSelect('comments.user', 'user')
      .getMany()

    return result.map((obj) =>{
      return {
        ...obj,
        post: {id: obj.post.id, title: obj.post.title}
      }
      }
    )
  }



  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, dto: UpdateCommentDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
