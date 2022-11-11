import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';

//Создаём кастомный декоратор который возвращает информацию о пользователе
export const User = createParamDecorator((_: unknown, ctx: ExecutionContext): UserEntity => {
  const request = ctx.switchToHttp().getRequest()
  return  request.user.id
})