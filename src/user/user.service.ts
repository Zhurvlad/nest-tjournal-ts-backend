import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchPostDto } from '../post/dto/serch-post.dto';
import { SearchUserDto } from './dto/serch-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne(cond);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('user');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    //Ищем в тайтле любое совпадение
    if (dto.fullName) {
      qb.andWhere(`user.fullName ILIKE :fullName`);
    }

    if (dto.email) {
      qb.andWhere(`user.email ILIKE :email `);
    }

    //Выносим параетры в переменные
    qb.setParameters({
      title: `%${dto.fullName}%`,
      tag: `%${dto.email}%`,
    });

    console.log(qb.getSql());

    const [items, totalCount] = await qb.getManyAndCount();

    return {
      items,
      totalCount,
    };
  }
}
