import { AuthService } from '../../domain/service/auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseModel } from '../../domain/model/auth-response.model';
import { LoginDTO } from '../dto/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() loginDTO: LoginDTO
  ): Promise<AuthResponseModel> {
    return this.authService.signIn(loginDTO.email, loginDTO.password);
  }
}
