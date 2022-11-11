import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query, UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/serch-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

//Контроллер просто возвращает результат выполненной работы

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  //Проверяем может ли пользователь оставлять, удалять и редавктировать статьи
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@User() userId: number, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  //Ищем самую популярную статью
  @Get('/popular')
  getPopularPosts() {
    return this.postService.popular();
  }

  @Get('/search')
  searchPosts(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }


}
