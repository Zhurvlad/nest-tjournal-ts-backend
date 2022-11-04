import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  //Передаем токен и расшифровываем его.
  // Если токен расшифрован то пользователь успешно валидировался

  async validate(payload: { sub: number; email: string }) {
    const data = {
      id: payload.sub,
      email: payload.email,
    };

    //Проверяем есть зарегестрирован ли данный пользователь на нашем сайте
    const user = await this.usersService.findByCond(data);

    if (!data) {
      throw new UnauthorizedException('У васнет доступа!');
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
