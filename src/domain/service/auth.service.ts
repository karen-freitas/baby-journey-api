import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './user.service';
import { AuthResponseModel } from '../model/auth-response.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(email: string, password: string): Promise<AuthResponseModel> {
    const foundUser = await this.usersService.findOne(email);
    if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: foundUser.id, username: foundUser.name };

    const token = this.jwtService.sign(payload);
    return { token, id: foundUser.id };
  }
}
