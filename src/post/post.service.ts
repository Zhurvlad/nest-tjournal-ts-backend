import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { SearchPostDto } from './dto/serch-post.dto';
import { UserEntity } from '../user/entities/user.entity';

//В сервисе мы выполняем всю логику и проверки
//Мы должны прописывать строго те данные которые мы ожидаем

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto, userId: number) {
    //т.к. мы используем эдитор JS  мы находим тип раный паараграфу и достаём из него текст
    const firstParagraph = dto.body.find(obj => obj.type === 'paragraph')?.data?.text
    return this.repository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: firstParagraph || '',
      //Делаем релейшен и связываем пользователя с его оставленным комментарием
      user: {id: userId}
    });
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('p');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    //Выбираем каким образом мы будем сортировать
    if (dto.views) {
      qb.orderBy('views', dto.views);
    }

    //andWhere позволяет сортировать по нескольким параетрам

    //Ищем в тексте любое совпадение
    if (dto.body) {
      qb.andWhere(`p.body ILIKE : body`);
    }

    //Ищем в тайтле любое совпадение
    if (dto.title) {
      qb.andWhere(`p.title ILIKE :title`);
    }

    if (dto.tag) {
      qb.andWhere(`p.tag ILIKE :tag `);
    }

    //Выносим параетры в переменные
    qb.setParameters({
      title: `%${dto.title}%`,
      tag: `%${dto.tag}%`,
      body: `%${dto.body}%`,
      views: dto.views || 'DESC',
    });

    console.log(qb.getSql());

    const [items, totalCount] = await qb.getManyAndCount();

    return {
      items,
      totalCount,
    };
  }

  //Делаем сортировку просмотра статей по убыванию
  // через кверибилеры
  async popular() {
    const qb = this.repository.createQueryBuilder('p');

    qb.orderBy('views', 'DESC');
    qb.limit(10);

    const [items, totalCount] = await qb.getManyAndCount();

    return {
      items,
      totalCount,
    };
  }

  //Бэк отдаёт список по убыванию самых популярных статей
  // popular() {
  //   return this.repository.find({
  //     order: {
  //       views: 'ASC',
  //     },
  //   });
  // }

  async findOne(id: number) {
    const find = await this.repository.findOne(id);

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    //Инкрементим колличество просмотров статьи
    await this.repository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({
        views: () => 'views + 1',
      })
      .execute();

    //Можно указать связь между Post и user с помощь {relations: ["user"]}
    return this.repository.findOne(id);

    // const find = await this.repository.findOneBy({ id });
    //
    // if (!find) {
    //   throw new NotFoundException('Статья не найдена');
    // }
    //
    // return find;
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const find = await this.repository.findOne(id);

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    const firstParagraph = dto.body.find(obj => obj.type === 'paragraph')?.data.text

    return this.repository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: firstParagraph || '',
      //Делаем релейшен и связываем пользователя с его оставленным комментарием
      user: {id: userId}
    });
  }

  async remove(id: number, userId: number) {
    const find = await this.repository.findOne(id);

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    if(find.user.id !== userId){
      throw new ForbiddenException('Вы не можете удалить статью которая не пренадлежит вам');
    }

    return this.repository.delete(id);
  }
}
