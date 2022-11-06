import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByCond({
      email,
      password,
    });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //Создаём функциюдля генерации JWT токена
  generateJwtToken(data: { id: number; email: string }) {
    const payload = { email: data.email, sub: data.id };
    return this.jwtService.sign(payload);
  }

  //Возвращаем всё кроме пароля, так же получаем JWT токен
  async login(user: UserEntity) {
    const { password, ...userData } = user;

    return {
      ...userData,
      token: this.generateJwtToken(userData),
    };
  }

  //Регестрируем пользователя
  async register(dto: CreateUserDto) {
    try {
      //Точно указываем что мы ожидаем от фронтэнда
      const { password, ...user } = await this.usersService.create({
        email: dto.email,
        fullName: dto.fullName,
        password: dto.password,
      });

      return {
        ...user,
        token: this.generateJwtToken(user),
      };
    } catch (e) {
      throw new ForbiddenException('Произошла ошибка', e);
    }
  }
}
