import { IsEmail, Length } from 'class-validator';
import { UniqueOnDatabase } from '../../auth/validations/UniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @Length(3)
  fullName: string;

  @IsEmail(undefined, { message: 'Неверная почта.' })
  @UniqueOnDatabase(UserEntity, { message: 'Данная почта уже существует!' })
  email: string;

  @Length(6, 32, { message: 'Пароль слишком короткий' })
  password?: string;
}
