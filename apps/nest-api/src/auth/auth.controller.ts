import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    await this.authService.sendMagicLink(email);
    return { message: 'Magic link enviado com sucesso' };
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    const user = await this.authService.verifyToken(token);
    if (user) {
      return { message: 'Token válido', user };
    } else {
      return { message: 'Token inválido' };
    }
  }
}
