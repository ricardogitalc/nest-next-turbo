import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
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
  async verify(
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.authService.verifyMagicLink(token);
      const jwt = this.authService.generateToken(user);

      response.cookie('jwt', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      });

      return { message: 'Autenticação bem-sucedida' };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  @Get('logged')
  async isLoggedIn(
    @Request() request: Request & { cookies: { [key: string]: string } },
  ) {
    const token = request.cookies['jwt'];
    if (!token) {
      return { isLoggedIn: false };
    }

    const isValid = await this.authService.verifyJwtToken(token);
    return { isLoggedIn: isValid };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logout realizado com sucesso' };
  }
}
